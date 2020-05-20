import {Component, OnInit} from '@angular/core';

import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis'
import {isNull} from "util";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'predicciones-co2',
  templateUrl: './predicciones-co2.component.html',
  styleUrls: ['./predicciones-co2.component.css']
})
export class PrediccionesCo2Component implements OnInit {

  // Datos de los paises
  anos: number[];
  emisiones: number[];

  // Datos de los paises convertidos a array de objetos
  datosEntrada = [];
  // datosEntrada normalizados y convertidos en Tensores
  datosNormalizados: any;

  // Declaración de los paises que es posible calcular sus emisiones de CO2
  paises = [
    {value: 'España'},
    {value: 'Portugal'},
    {value: 'Francia'}
  ]
  paisSeleccionado: any;

  // Declaración del modelo y el visor de TensorFlow
  model: tf.Sequential;
  tfvisor: any;

  constructor(private titulo: Title) {
  }

  ngOnInit() {
    this.titulo.setTitle('Predicciones CO2');
  }

  crearVisor() {
    this.tfvisor = tfvis.visor();
  }

  ocultarMostrarVisor() {
    this.tfvisor.toggle();
  }

  seleccionPais(event) {
    this.paisSeleccionado = event;
  }

  cargarDatos() {
    this.anos = [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999,
      2000, 2001, 2002, 2003, 2004, 2005, 2006,
      2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];

    switch (this.paisSeleccionado) {
      case 'España':
        this.emisiones = [235.79, 245.88, 255.13, 246.68, 259.58, 273.85, 261.81, 274.81,
          283.83, 308.02, 320.37, 322.46, 342.25, 346.68, 364.25, 379.52, 371.19, 379.91,
          348.41, 308.29, 295.41, 297.46, 291.64, 265.07, 268.13, 285.20, 276.00, 291.35];
        break;
      case 'Portugal':
        this.emisiones = [47.28, 48.91, 53.28, 51.81, 52.63, 56.71, 53.98, 57.08, 61.66,
          69.48, 68.35, 67.92, 71.66, 66.74, 69.69, 72.04, 67.45, 65.09, 62.80, 59.71,
          55.77, 54.65, 52.86, 51.11, 51.14, 55.48, 53.89, 58.68];
        break;
      case 'Francia':
        this.emisiones = [409.23, 434.48, 425.27, 405.74, 400.95, 408.07, 424.24, 417.43, 437.84,
          435.38, 430.33, 434.95, 430.24, 437.14, 439.17, 442.69, 432.57, 422.75, 416.56, 397.99,
          405.75, 381.77, 382.05, 382.98, 351.69, 358.30, 359.88, 363.71];
        break;
      default:
        alert('Debes seleccionar un país para cagar los datos.')
    }
    this.mostrarDatosCargadosVisor();
  }

  mostrarDatosCargadosVisor() {
    // En caso de que se cargen otros datos limpio datosEntrada
    this.datosEntrada = [];
    for (let i in this.anos) {
      this.datosEntrada.push({
        index: this.anos[i], value: this.emisiones[i]
      });
    }

    if (isNull(this.tfvisor)) {
      this.crearVisor();
    }

    // Mostrar en el visor los datos en una gráfica de barras
    tfvis.render.barchart(
      {name: 'CO2/año', tab: 'Datos de entrada'},
      this.datosEntrada,
      {height: 400, xLabel: 'Año', yLabel: 'Millones de toneladas CO2'}
    );
  }


  /**
   * Función asincrona en la que se crea el modelo, los tensores y se realiza el entrenamiento del modelo
   */
  async entrenarModelo() {
    // Creación del modelo, en este caso es de tipo secuencial(las entradas de una
    // capa son las salidas a la siguiente, es una simple pila de capas sin bifurcaciones ni saltos)
    this.model = tf.sequential();

    // Capa de entrada, recibe un valor y tiene 50 nuronas.
    this.model.add(tf.layers.dense({inputShape: [1], units: 50}));
    // Capa intermedia con 50 neuronas y función de activación relu (función encargada de asignar pesos a cada neurona)
    this.model.add(tf.layers.dense({units: 50, activation: 'relu'}));
    // Capa de salida como solo obtendremos un valor tiene una neurona.
    this.model.add(tf.layers.dense({units: 1}));

    // Definir parámetros de compilación de los datos en el modelo (configuración de perdida y optimizador)
    this.model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ['mse'],
    });

    // Obtención de los datos normalizados para usarlos en el entrenamiento.
    this.datosNormalizados = this.convertirDatosEnTensores(this.datosEntrada);
    const {inputs, labels} = this.datosNormalizados;

    // batchSize Se refiere al tamaño de los subconjuntos de datos que verá el modelo en cada iteración de entrenamiento.
    // Los tamaños de lote comunes tienden a estar en el rango de 32-512.
    const batchSize = 32;
    // Número de veces que se procesarán todos los datos para el entrenamiento.
    const epochs = 300;
    // Definición de nombre de las métricas y la pestaña donde serán mostradas
    const container = {
      name: 'Progreso del entrenamiento', tab: 'Entrenamiento'
    };
    //Guarda los valores de perdida
    const history = [];
    // Metricas que serán mostradas en gráficas
    const metrics = ['loss'];

    // Entrenamiento del modelo, recibe los datos con los que será entrenada la red neuronal,
    // el tamaño de subconjuntos, el número de iteraciones del entrenamiento, shuffle es para barajar
    // los datos y callbacks mostrará datos del entrenamiento definidos en la función mostrarEntrenamiento()
    await this.model.fit(inputs, labels, {
      batchSize: batchSize, epochs: epochs, shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, log) => {
          history.push(log);
          tfvis.show.history(container, history, metrics);
        }
      }
    });
  }

  /**
   * Esta función es la encargada de convertir los datos en Tensores y a demás realiza la normalización de los
   * datos(transformar en valores comprendidos entre 0 y 1 para facilitar el entrenamiento del modelo).
   * La función tidy() elimina de la memoria automáticamente todos los Tensores intermedios que ya no son necesarios.
   * @param datos
   * @return
   */
  convertirDatosEnTensores(datos) {
    return tf.tidy(() => {
      // Paso 1. Mezclar los datos
      // La aleatoriedad de datos ayuda al entrenamiento evitando que se acostumbre a un grupo de datos similares
      tf.util.shuffle(datos);

      // Paso 2. Convertir los datos en Tensores
      const inputs = datos.map(d => d.index);
      const labels = datos.map(d => d.value);
      const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
      const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

      // Paso 3. Normalizar os datos en el rango de 0 - 1 usando el escalado min - max
      const inputMax = inputTensor.max();
      const inputMin = inputTensor.min();
      const labelMax = labelTensor.max();
      const labelMin = labelTensor.min();
      const inputsNormalizados = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
      const labelsNormalizados = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

      return {
        inputs: inputsNormalizados, labels: labelsNormalizados,
        // Devuelve los límites min / max para que podamos usarlos más tarde.
        inputMax, inputMin, labelMax, labelMin,
      };
    });
  }

  /**
   * Mostrará los valores originales y valores predecidos por el modelo para la evaluación del modelo
   */
  private testModelo() {
    const {inputMax, inputMin, labelMin, labelMax} = this.datosNormalizados;

    // Generar predicciones para un rango uniforme de números entre 0 y 1;
    // Desnormalizamos los datos realizando la inversión de escala min-max que hicimos anteriormente.
    const [xs, preds] = tf.tidy(() => {
      // xs contine 10 valores generados de ejemplo
      // tslint:disable-next-line:no-shadowed-variable
      const xs = tf.linspace(0, 1, 10);

      // Predicciones para los valores de ejemplo
      // tslint:disable-next-line:no-shadowed-variable
      const preds = this.model.predict(xs.reshape([10, 1]));

      // Desnormalización de los datos
      const unNormXs = xs.mul(inputMax.sub(inputMin)).add(inputMin);

      // Desnormalización de los datos predecidos
      // @ts-ignore
      const unNormPreds = preds.mul(labelMax.sub(labelMin)).add(labelMin);

      // .dataSync () es un método que podemos usar para obtener una matriz de tipos de los valores
      // almacenados en un tensor.
      // Esto nos permite procesar esos valores en JavaScript normal.
      // Esta es una versión sincrona del método data() que generalmente es preferible su uso.
      return [unNormXs.dataSync(), unNormPreds.dataSync()];
    });

    // Construcción de un array de objetos con los datos predecidos
    const predictedPoints = Array.from(xs).map((val, i) => {
      return {x: val, y: preds[i]};
    });

    // Construcción de un array de objetos con los datos de entrada
    const originalPoints = this.datosEntrada.map(d => ({
      x: d.index, y: d.value,
    }));

    console.log(originalPoints);

    // Resderizado en el visor de los datos de entrada y los predecidos para comprobar la eficiencia del modelo.
    tfvis.render.scatterplot(
      {name: 'Datos Originales vs Predicciones del modelo', tab: 'Test'},
      {values: [originalPoints, predictedPoints], series: ['Original', 'Predecido']},
      {
        xLabel: 'Años',
        yLabel: 'Millones de toneladas CO2',
        height: 400,
        zoomToFit: true
      }
    );
  }

}
