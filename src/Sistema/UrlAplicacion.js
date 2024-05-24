import Vanie from 'vanie';
import Aplicacion from './Aplicacion'

export default class UrlAplicacion{
    #app;
    #url;
    #nombreAplicacion;

    constructor(nombre,ico,anclado = false){
        if(typeof(nombre) != 'string' || nombre.trim() == '')
            throw ('el objeto necesita un nombre valido');
        this.#nombreAplicacion = nombre.trim()
        this.#app = new Aplicacion(this.#nombreAplicacion,ico,anclado);}

    set url(objetoURL){this.#url = objetoURL;}
    get url(){return this.#url;}
    get app(){return this.#app;}

    configurarVentana(funcion){this.#app.configurarVentana(funcion);}

    abrirInstancia(alias){
        const ventanaNueva = new Vanie;
        const url = this.#url[alias][1];
        const titulo = this.#url[alias][0];
        ventanaNueva.cargarURL(url);
        const id = this.#app.agregarVentana(ventanaNueva,titulo);
        ventanaNueva.abrir();
        return id;}

    ventanaPrincipal(ventana,titulo){this.#app.agregarVentanaPrincipal(ventana,titulo);}
    ventanaUnica(ventana,titulo){this.#app.agregarVentanaUnica(ventana,titulo);}

    interruptor(alias){this.#app.interruptorVentana(alias);}
        
    cerrarVentana(id){
        const ventana = this.#app.obtenerVentana(id);
        ventana?.cerrar();}}