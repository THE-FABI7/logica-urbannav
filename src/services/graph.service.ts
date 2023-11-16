import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import fetch from 'node-fetch';
import {configuracionSeguridad} from '../config/configuracion.seguridad';
import {Edge} from '../graph/edge';
import {Graph} from '../graph/graph';
import {Node} from '../graph/node';
import {DistanceRepository, LocationRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class GraphService {
  constructor(
    @repository(LocationRepository)
    private locationRepository: LocationRepository,
    @repository(DistanceRepository)
    private distanceRepository: DistanceRepository
  ) { }

  /*
   * Add service methods here
   */

  async buildGraph(): Promise<Graph> {
    const locations = await this.locationRepository.find();
    const nodes: Node[] = [];

    for await (const location of locations) {

      const distances = await this.distanceRepository.find({
        where: {
          OriginId: location._id!
        }
      });

      const edges: Edge[] = [];
      // convert distances to edges
      for await (const distance of distances) {
        const destination = await this.locationRepository.findById(distance.DestinationId);
        // convert destination in Node
        const node = new Node(destination._id!, destination.Name, destination.Key);
        edges.push(new Edge(node, distance.Meters));
      }

      nodes.push(new Node(location._id!, location.Name, location.Key, edges));
    }

    return new Graph(nodes);
  }

  // print the graph node by node with edges in console
  printGraph(graph: Graph) {
    const nodes = graph.getNodes();
    for (const node of nodes) {
      console.log(node);
    }
  }


  async dijkstra(startNodeId: string, endNodeId: string): Promise<string[]> {
    const distances: Record<string, number> = {};
    const visited: Record<string, boolean> = {};
    const previousNodes: Record<string, string | null> = {};

    const graph = await this.buildGraph();
    const nodes = graph.getNodes();

    // Inicialización de distancias y nodos anteriores
    nodes.forEach((node) => {
      distances[node.getId()] = Infinity;
      visited[node.getId()] = false;
      previousNodes[node.getId()] = null;
    });

    distances[startNodeId] = 0;

    // Función auxiliar para encontrar el nodo no visitado con la menor distancia
    const findMinDistanceNode = () => {
      let minDistance = Infinity;
      let minNodeId = null;
      for (const nodeId in distances) {
        if (!visited[nodeId] && distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          minNodeId = nodeId;
        }
      }
      return minNodeId;
    };

    // Algoritmo de Dijkstra
    for (let i = 0; i < nodes.length; i++) {
      const currentNodeId = findMinDistanceNode();

      if (currentNodeId === null || distances[currentNodeId] === Infinity) {
        break; // Todos los nodos inalcanzables han sido visitados
      }

      const currentNode = graph.getNodeById(currentNodeId);
      visited[currentNodeId] = true;

      // Actualizar distancias y nodos anteriores para los nodos vecinos
      currentNode?.getEdges().forEach((edge) => {
        const neighborNodeId = edge.getNode().getId();
        const tentativeDistance = distances[currentNodeId] + edge.getWeight();

        if (tentativeDistance < distances[neighborNodeId]) {
          distances[neighborNodeId] = tentativeDistance;
          previousNodes[neighborNodeId] = currentNodeId;
        }
      });
    }

    // Reconstruir el camino más corto desde el nodo de inicio al nodo de destino
    const path: string[] = [];
    let currentNodeId: string | null = endNodeId;

    while (currentNodeId !== null) {
      path.unshift(currentNodeId);
      currentNodeId = previousNodes[currentNodeId] ?? null;
    }

    return path;
  }

  async dijkstraTotalDistance(startNodeId: string, endNodeId: string): Promise<number> {
    const distances: Record<string, number> = {};
    const visited: Record<string, boolean> = {};

    const graph = await this.buildGraph();
    const nodes = graph.getNodes();

    // Inicialización de distancias
    nodes.forEach((node) => {
      distances[node.getId()] = Infinity;
      visited[node.getId()] = false;
    });

    distances[startNodeId] = 0;

    // Función auxiliar para encontrar el nodo no visitado con la menor distancia
    const findMinDistanceNode = () => {
      let minDistance = Infinity;
      let minNodeId = null;
      for (const nodeId in distances) {
        if (!visited[nodeId] && distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          minNodeId = nodeId;
        }
      }
      return minNodeId;
    };

    // Algoritmo de Dijkstra
    for (let i = 0; i < nodes.length; i++) {
      const currentNodeId = findMinDistanceNode();

      if (currentNodeId === null || distances[currentNodeId] === Infinity) {
        break; // Todos los nodos inalcanzables han sido visitados
      }

      const currentNode = graph.getNodeById(currentNodeId);
      visited[currentNodeId] = true;

      // Actualizar distancias para los nodos vecinos
      currentNode?.getEdges().forEach((edge) => {
        const neighborNodeId = edge.getNode().getId();
        const tentativeDistance = distances[currentNodeId] + edge.getWeight();

        if (tentativeDistance < distances[neighborNodeId]) {
          distances[neighborNodeId] = tentativeDistance;
        }
      });
    }

    // Obtener la distancia total recorrida hasta el nodo de destino
    const totalDistance = distances[endNodeId];

    return totalDistance !== Infinity ? totalDistance : -1; // Devolver -1 si no hay un camino válido
  }

  async dijkstraTotalDise(startNodeId: string, endNodeId: string): Promise<{distance: number; cost: number}> {
    const distances: Record<string, number> = {};
    const visited: Record<string, boolean> = {};
    const graph = await this.buildGraph();
    const nodes = graph.getNodes();
    let totalCost = 0; // Inicializar totalCost
    let precioPorKilometro = 0;

    try {
      const urlVariablesEntorno = `${configuracionSeguridad.enlaceMicroservicioSeguridad}/variables-general-del-sistemas`;

      // Obtener el token de acceso desde tu sistema de autenticación
      const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZmFiaWFuVXJiYW5uYXYgYXBlbGxpZG9wIiwicm9sZSI6IjY1MTU4MDdjNzk4NTcyMjMzODY5Mzg5ZCIsImVtYWlsIjoiZmFiaWFuZ3VhbmNoYTEzQGdtYWlsLmNvbSIsImlhdCI6MTY5OTgxODM4M30.XvdnBGyc4zzKHr6lHO2FE08iNRqIXch52YF4yZy8k3Q'; // Reemplaza con tu lógica para obtener el token

      const response = await fetch(urlVariablesEntorno, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        const variablesEntorno = Array.isArray(json) ? json[0] : json;
        precioPorKilometro = variablesEntorno.valorporKilometro / 1000;
        totalCost = precioPorKilometro;
      }
    } catch (e) {
      // Manejar errores de la solicitud a la API de variables de entorno
      console.error('Error al obtener variables de entorno:', e);
    }

    // Inicialización de distancias y costos
    nodes.forEach((node) => {
      distances[node.getId()] = Infinity;
      visited[node.getId()] = false;
    });

    distances[startNodeId] = 0;

    // Función auxiliar para encontrar el nodo no visitado con la menor distancia
    const findMinDistanceNode = () => {
      let minDistance = Infinity;
      let minNodeId = null;
      for (const nodeId in distances) {
        if (!visited[nodeId] && distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          minNodeId = nodeId;
        }
      }
      return minNodeId;
    };

    // Algoritmo de Dijkstra
    for (let i = 0; i < nodes.length; i++) {
      const currentNodeId = findMinDistanceNode();

      if (currentNodeId === null || distances[currentNodeId] === Infinity) {
        break; // Todos los nodos inalcanzables han sido visitados
      }

      const currentNode = graph.getNodeById(currentNodeId);
      visited[currentNodeId] = true;

      // Actualizar distancias y costo para los nodos vecinos
      currentNode?.getEdges().forEach((edge: Edge) => {
        const neighborNodeId = edge.getNode().getId();
        const tentativeDistance = distances[currentNodeId] + edge.getWeight();

        if (tentativeDistance < distances[neighborNodeId]) {
          distances[neighborNodeId] = tentativeDistance;
        }
      });
    }

    const totalDistance = distances[endNodeId];
    totalCost = totalDistance * precioPorKilometro;

    return {distance: totalDistance, cost: totalCost};
  }


  async getNearbyNodeIds(startNodeId: string, maxDistance: number): Promise<string[]> {
    const distances: Record<string, number> = {};
    const visited: Record<string, boolean> = {};

    const graph = await this.buildGraph();
    const initialNode = graph.getNodeById(startNodeId);

    if (!initialNode) {
      throw new Error(`Node with ID ${startNodeId} not found.`);
    }

    // Inicialización de distancias
    graph.getNodes().forEach((node) => {
      distances[node.getId()] = Infinity;
      visited[node.getId()] = false;
    });

    distances[startNodeId] = 0;

    // Función auxiliar para encontrar el nodo no visitado con la menor distancia
    const findMinDistanceNode = () => {
      let minDistance = Infinity;
      let minNodeId = null;
      for (const nodeId in distances) {
        if (!visited[nodeId] && distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          minNodeId = nodeId;
        }
      }
      return minNodeId;
    };

    // Algoritmo de Dijkstra
    for (let i = 0; i < graph.getNodes().length; i++) {
      const currentNodeId = findMinDistanceNode();

      if (currentNodeId === null || distances[currentNodeId] === Infinity) {
        break; // Todos los nodos inalcanzables han sido visitados
      }

      const currentNode = graph.getNodeById(currentNodeId);
      visited[currentNodeId] = true;

      // Actualizar distancias para los nodos vecinos
      currentNode?.getEdges().forEach((edge: Edge) => {
        const neighborNode = edge.getNode();
        const neighborNodeId = neighborNode.getId();
        const tentativeDistance = distances[currentNodeId] + edge.getWeight();

        if (tentativeDistance < distances[neighborNodeId]) {
          distances[neighborNodeId] = tentativeDistance;
        }
      });
    }

    // Filtrar nodos dentro de la distancia establecida
    const nearbyNodeIds: string[] = Object.keys(distances).filter(
      (nodeId) => distances[nodeId] <= maxDistance
    );

    return nearbyNodeIds;
  }
}







