import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";

import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

@Component({
  selector: 'crear-prediccion',
  templateUrl: './crear-prediccion.component.html',
  styleUrls: ['./crear-prediccion.component.css']
})
export class CrearPrediccionComponent implements OnInit {

  // Declaración del modelo y el visor de TensorFlow
  model: tf.Sequential;
  tfvisor: any;

  // Número capas, neuronas y numero de epocas de entrenamiento
  capas = 0;
  neuronas = 1;
  epocas = 20;

  // Datos de entrada usuario
  xEntrada = "-1, 0, 1, 2, 3, 4";
  yEntrada = "-3, -1, 1, 3, 5, 7";

  // Valor de la X para predecir la Y
  xDeYpredecida = "10, 250";

  constructor(private titulo: Title) {
  }

  ngOnInit() {
    this.titulo.setTitle('Crear predicción')
  }

  crearVisor() {
    this.tfvisor = tfvis.visor();
  }

  ocultarMostrarVisor() {
    this.tfvisor.toggle();
  }

  async entrenarModelo() {
    this.model = tf.sequential();

    // Agregar la capa de entrada al modelo
    this.model.add(tf.layers.dense({units: this.neuronas, inputShape: [1]}));

    // Capas definidas por el usuario
    for (let i = 0; i < this.capas; i++) {
      this.model.add(tf.layers.dense({units: this.neuronas}));
    }

    // Agregar la capa de salida del modelo
    this.model.add(tf.layers.dense({units: 1}));

    // Optimizdor para regresiones lineales, descenso de gradiente estocástico(sgd)
    this.model.compile({
      optimizer: 'sgd',
      loss: tf.losses.meanSquaredError,
      metrics: ['mse']
    });

    let arrayX = this.convertirString(this.xEntrada);
    let arrayY = this.convertirString(this.yEntrada);

    const xs = tf.tensor2d(arrayX, [arrayX.length, 1]);
    const ys = tf.tensor2d(arrayY, [arrayY.length, 1]);

    // Definición de nombre de las métricas y la pestaña donde serán mostradas
    const container = {name: 'Progreso del entrenamiento', tab: 'Entrenamiento'};
    //Guarda los valores de perdida
    const history = [];
    // Metricas que serán mostradas en gráficas
    const metrics = ['loss'];

    await this.model.fit(xs, ys, {
      epochs: this.epocas,
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, log) => {
          history.push(log);
          tfvis.show.history(container, history, metrics);
        }
      }
    });
  }

  realizarPrediccion() {
    const originalPoints = [];
    const arrayX = this.convertirString(this.xEntrada);
    const arrayY = this.convertirString(this.yEntrada);

    for (let i in arrayX) {
      originalPoints.push({x: arrayX[i], y: arrayY[i]})
    }
    const arrayXdeYpredecidas = this.convertirString(this.xDeYpredecida);
    const ys = this.model.predict(tf.tensor2d(arrayXdeYpredecidas, [arrayXdeYpredecidas.length, 1]));

    // Muestro las previsiones en un alert
    alert('Las predicciones de las x: ' + arrayXdeYpredecidas + '\nSon: ' + ys);

    // Construcción de un array de objetos con los datos predecidos.
    // Hay que convertir el Tensor xs en un array normal, pero me es imposible encontrar la manera
    const predictedPoints = Array.from(ys).map((val, i) => {
      return {x: this.xDeYpredecida[i], y: val};
    });

    // Resderizado en el visor de los datos de entrada y los predecidos para comprobar la eficiencia del modelo.
    tfvis.render.scatterplot(
      {name: 'Datos Originales y Predicciones del modelo', tab: 'Test'},
      {values: [originalPoints, predictedPoints], series: ['Original', 'Predecido']},
      {
        xLabel: 'Valores X',
        yLabel: 'Valores Y',
        height: 400
      }
    );
  }

  /**
   * Convierte la cadena recibida en un array de numeros siempre que estos sean carácteres numéricos.
   * @param cadena
   */
  convertirString(cadena: string): number[] {
    let arrayNumeros = [];
    for (let i of cadena.split(',')) {
      arrayNumeros.push(parseFloat(i));
    }
    // Comprobación de que los valores introducidos son números
    for (let i of arrayNumeros) {
      if (isNaN(i)) {
        alert('Se han introducido caracteres que no son números, compueba que los datos de entrada sean correctos.');
        return;
      }
    }
    return arrayNumeros;
  }


}
