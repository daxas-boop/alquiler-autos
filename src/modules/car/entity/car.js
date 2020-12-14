module.exports = class Car {
  constructor({
    id,
    marca,
    modelo,
    año,
    kilometros,
    color,
    aire,
    pasajeros,
    transmision,
    precio,
    imagen,
  }) {
    this.id = id;
    this.marca = marca;
    this.modelo = modelo;
    this.año = año;
    this.kilometros = kilometros;
    this.color = color;
    this.aire = aire;
    this.pasajeros = pasajeros;
    this.transmision = transmision;
    this.precio = precio;
    this.imagen = imagen;
  }
};
