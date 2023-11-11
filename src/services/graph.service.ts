import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Edge} from '../graph/edge';
import {Graph} from '../graph/graph';
import {Node} from '../graph/node';
import {DistanceRepository, LocationRepository} from '../repositories';
import {configuracionSeguridad} from '../config/configuracion.seguridad';
import fetch from 'node-fetch';

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

    const urlVariablesEntorno = `${configuracionSeguridad.enlaceMicroservicioSeguridad}/variables-general-del-sistemas`;
    try {
      await fetch(urlVariablesEntorno, {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
      }).then((res: any) => res.json())
        .then((json: any) => {
          if (json) {
            const variablesEntorno = json;
            const distanciaTotal = distances[endNodeId];
            const precioPorKilometro = variablesEntorno.precioPorKilometro;
            const precioTotal = distanciaTotal * precioPorKilometro;
            console.log("distanciaTotal = " + distanciaTotal,"PrecioxKM = " + precioPorKilometro,"precioTotal = " + precioTotal);
            return precioTotal;
          }
        });
    } catch (e) {

    }
    // Obtener la distancia total recorrida hasta el nodo de destino
    const totalDistance = distances[endNodeId];

    return totalDistance !== Infinity ? totalDistance : -1; // Devolver -1 si no hay un camino válido
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
      (nodeId) => distances[nodeId] <= maxDistance && nodeId !== startNodeId
    );

    return nearbyNodeIds;
  }
}







