import Vanie from 'vanie';
import Aplicacion from './Aplicacion'

export default class UrlAplicacion{
    #app;
    #nombreAplicacion;

    constructor(comando,nombre,ico,app,anclado = false){
        if(typeof(nombre) != 'string' || nombre.trim() == '')
            throw ('el objeto necesita un nombre valido');
        this.#nombreAplicacion = nombre.trim()
        this.#app = new Aplicacion(comando,this.#nombreAplicacion,ico,app,anclado);}

    get app(){return this.#app;}

    configurarVentana(funcion){this.#app.configurarVentana(funcion);}

    abrirInstancia(titulo,url){
        if(!titulo || !url){
            this.#app.abrir();
            return;}
        const ventanaNueva = new Vanie;
        ventanaNueva.cargarURL(url);
        this.#app.agregarVentana(ventanaNueva,titulo);
        ventanaNueva.abrir();}

    ventanaPrincipal(ventana,titulo){this.#app.agregarVentanaPrincipal(ventana,titulo);}
    ventanaUnica(ventana,titulo){this.#app.agregarVentanaUnica(ventana,titulo);}

    interruptor(alias){this.#app.interruptorVentana(alias);}
        
    cerrarVentana(id){
        const ventana = this.#app.obtenerVentana(id);
        ventana?.cerrar();}}