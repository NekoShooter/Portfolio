import Lanzador from "./Lanzador";
import Capturadora from "./Capturadora";
import { globalVanie , Vanie } from "vanie";
import kernel from "./Kernel";

export default class Aplicacion{
    #dock = kernel.DOCK;
    #capturadora = new Capturadora;
    #listaVentanas = new Map;
    #comando;
    #ventana_unica;
    #ventana_principal;
    #ventana_actual;
    #contador = 0;
    #lanzador;
    #nombreApp;
    #configVanie;

    constructor(comando,nombreAplicacion,icono,anclado = false){
        this.#comando = comando;
        this.#nombreApp = nombreAplicacion;
        this.#lanzador = new Lanzador(comando,icono,anclado);
        this.#lanzador.ventanas = this.#listaVentanas;
        this.#capturadora.conectarLanzador(this.#lanzador);
        this.#click();}

    get lanzador(){return this.#lanzador;}
    set personalizarCapturas(funcion){this.#capturadora.capturaPersonalizada = funcion;}
    get ventanasAlmacenadas(){return this.#listaVentanas.size;}
    get ventanasDisponibles(){
        if(!this.ventanaPredeterminada) return this.#listaVentanas.size;
        const ventanas = this.#listaVentanas.size - (this.ventanaPredeterminada.estaCerrado ? 1 : 0);
        return ventanas < 0 ? 0 : ventanas;}
    get comando(){return this.#comando;}
    get id(){return this.#nombreApp;}

    forEach(funcion){this.#listaVentanas.forEach(funcion)}

    configurarVentana(funcion){
        if(typeof funcion != 'function') return;
        this.#configVanie = funcion;}

    #cambiarDataVentana(ventana){
        if(!this.#configVanie) return;
        this.#configVanie(ventana);}
    
    #actualizarPosicion(id=undefined){
        const ajustarRetorno = (ventana)=>{
            if(!(ventana instanceof Vanie)) return;
            kernel.DOCK.zIndex = globalVanie.ventanasVisibles + 2;
            const dim = this.#lanzador.dimencion;
            const pos = this.#lanzador.coordenadaAbsoluta;
            ventana.cambiarPuntoDeRetorno(pos.x + dim.w/2, pos.y + dim.h/2);}

        if(!id) this.#listaVentanas.forEach(nodo=>{ajustarRetorno(nodo.ventana);});
        else ajustarRetorno(this.obtenerVentana(id));}


    agregarVentana(ventana, titulo){return this.#almacenarVentanas(ventana, titulo);}
    agregarVentanaUnica(ventana, titulo){return this.#almacenarVentanas(ventana, titulo,1);}
    agregarVentanaPrincipal(ventana, titulo){return this.#almacenarVentanas(ventana, titulo,2);}

    #almacenarVentanas(ventana, titulo, tipo = 0){
        if(!(ventana instanceof Vanie )|| !this.#dock || this.#ventana_unica) return;
        this.#lanzador.apertura();
        const v = ['simple','unica','principal']
        
        if((this.#ventana_unica && this.ventanasAlmacenadas > 1) || (tipo == 2 && this.#ventana_principal))
            throw(`Conflicto de asignacion de ventana ${v[tipo]}`);
        this.#ventana_actual = ventana;
        
        const id = !tipo ? `${this.#comando}_${this.#contador++}`: v[tipo];
        ventana.identificador = id;
        if(tipo == 1) this.#ventana_unica = ventana;
        else if(tipo == 2) this.#ventana_principal = ventana;

        this.#listaVentanas.set(id,ventana);
        ventana.titulo = titulo;
        ventana.justificadoTitulo = 'center';
        this.#cambiarDataVentana(ventana);

        ventana.addEventListener('cerrar',()=>{
            this.#capturadora.eliminarCaptura(id);
            if(!tipo){
                if(this.#ventana_actual == ventana) this.#ventana_actual = this.ventanaPredeterminada;
                this.#listaVentanas.delete(id);
                ventana.desconectarseDelGestor();
                if(!this.#listaVentanas.size) this.#contador = 0;}

            if(this.#lanzador.numMarcadores > this.ventanasDisponibles)
                this.#lanzador.quitarMarcador();
            if(!this.ventanasDisponibles) {
                this.#capturadora.desconertarDelKernel();
                this.#lanzador.colapso();}});

        ventana.addEventListener('abrir',()=>{
            this.#actualizarPosicion(id);
            this.#lanzador.mostrarMarcador();
            this.#capturadora.crearCaptura(id,ventana);
        });

        if(!tipo) {this.interruptorVentana(ventana);}
        return id;}


    obtenerVentana(id){return this.#listaVentanas.get(id)}
    get ventanaPrincipal(){return this.#ventana_principal;}
    get ventanaUnica(){return this.#ventana_unica;}
    get ventanaPredeterminada(){return this.#ventana_unica??this.#ventana_principal;}


    #ocultarMenu(){
        const menu = kernel.menu;
        const visible = menu?.esVisible;

        if(visible) menu.interruptor();
            
        return visible;}


    interruptorVentana(id){
        if(!id) return;
        const ventana = this.obtenerVentana((id instanceof Vanie)?id.identificador:id);
        //if(!ventana || (/*this.#ocultarMenu() &&*/ (!ventana.estaMinimizado && !ventana.estaAbierto))) return;
        
        ventana?.abrir();
        /*
        if(ventana.estaCerrado){
            this.#lanzador.apertura();
            ventana.abrir();
            kernel.DOCK.zIndex = globalVanie.ventanasVisibles + 2;}
        else ventana.minimizar();*/}

    #click(){
        this.#lanzador.addEventListener('click',e=>{
            this.#ocultarMenu();
            if(this.ventanasDisponibles > 1) {
                if(!this.#capturadora.esVisible) kernel.capturadoras.forEach(cap=>cap.ocultarMiniaturas())
                this.#capturadora.interruptorMiniaturas();
                this.#dock.interruptor(e);
                }
            else{/*
                const vPrincipal = this.ventanaPredeterminada;
                this.#dock.activar();
                if(vPrincipal){
                    if(vPrincipal.estaAbierto)
                        this.interruptorVentana(vPrincipal);
                    else if(this.ventanaUnica) this.ventanaUnica.abrir();
                    else{
                        this.#listaVentanas.forEach(ventana=>{
                            if(ventana.identificador != vPrincipal.identificador)
                                this.interruptorVentana(ventana);});}}
                else{
                    this.interruptorVentana(...this.#listaVentanas.keys());}*/
                this.abrir();
            }
        });}
        
    abrir(){
        const vPrincipal = this.ventanaPredeterminada;
        if(vPrincipal){
            this.#dock.activar();
            if(vPrincipal.estaAbierto)
                this.interruptorVentana(vPrincipal);
            else if(this.ventanaUnica) this.ventanaUnica.abrir();
            else{
                this.#listaVentanas.forEach(ventana=>{
                    if(ventana.identificador != vPrincipal.identificador)
                        this.interruptorVentana(ventana);});}}
        else if (this.ventanasDisponibles == 1){
            this.#dock.activar();
            this.interruptorVentana(...this.#listaVentanas.keys());}}}