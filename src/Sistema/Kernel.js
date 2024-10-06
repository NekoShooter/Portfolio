import { globalVanie } from "vanie";
import BarraMac from "./DockMac";
import Dock from "./Dock";
import Ruta from "./Ruta";

class Kernel{
    #os;
    #boolOs = [false,false,false]
    #tema;
    #esTemaOscuro = false;
    #dock;
    #contenedorDock;
    #escritorio;
    #capturadoras = new Map;
    #registros = 0;
    miniaturasVisible;
    #adminApp = new Map;
    #ruta = new Ruta('Inicio','home');
    #aplicaciones = new Ruta('Aplicaciones','app');
    
    constructor(){
        this.ocultarTodasLasMiniaturas = this.ocultarTodasLasMiniaturas.bind(this);
        this.interruptorTema = this.interruptorTema.bind(this);
        this.agregarNuevaRuta(this.#aplicaciones);}

    agregarNuevaRuta(cd){this.#ruta.agregarRuta(cd);}
    get ruta(){return this.#ruta;}

    escritorio(id){
        if(typeof id == 'string' && id.trim() != '')
            this.#escritorio = document.getElementById(id);
            window.addEventListener('click',e=>{
                if(!this.miniaturasVisible || !this.miniaturasVisible.esVisible) return;
                    this.#ocutarMiniaturas(e);
            });
            globalVanie.conectarseA(this.#escritorio);
        if(!globalVanie.padre) throw('error al asignar el escritorio');
        //this.#estilar();
        this.#asignarClaseEscritorio();
        return this;}

    bloquearEscritorio(boleano){
        if(boleano) this.#escritorio.classList.add(globalVanie.globalClass('bloqueado'));
        else this.#escritorio.classList.remove(globalVanie.globalClass('bloqueado'));
    }
    
    #ocutarMiniaturas(e){
        let ocultar = true;
        for(const miniatura of this.miniaturasVisible.capturas.values()){
            for(const nodo of miniatura.childNodes)
                if(e.target === nodo){
                    ocultar = false;
                    break;} }
        if(ocultar)
            this.miniaturasVisible.ocultarMiniaturas();}

    #asignarClaseEscritorio(){this.#escritorio.setAttribute('class','escritorio-'+kernel.os);}

    get capturadoras(){return this.#capturadoras;}

    registrarCapturadora(capturadora){
        if(!capturadora) return;
        const llave = `c${this.#registros++}`;
        this.#capturadoras.set(llave, capturadora);
        return llave;}
    removerCapturadora(llave){
        if(!llave) return;
        const cap = this.#capturadoras.get(llave);
        if(!cap) return;
        this.#capturadoras.delete(llave);}

    ocultarTodasLasMiniaturas(){
        this.#capturadoras.forEach(miniaturas=>{miniaturas.ocultarMiniaturas();});}

    registrarApp(comando,nombreAplicacion,App){
        this.#aplicaciones.nuevoArchivo(nombreAplicacion,comando);
        this.#adminApp.set(comando,App);}
        
    aplicacion(llave){
        if(!llave) return;
        return this.#adminApp.get(llave);}

    dock(id){
        if(typeof id== 'string' && id.trim() != '')
            this.#contenedorDock = document.getElementById(id);
        if(!this.#contenedorDock) throw('error al asignar la barra');
        this.#crearDock();
        return this;}

    get data(){
        return {
            medidaDock:{windows:0,linux:0,mac:70}[this.#os],
            medidaLanzador: {windows:0,linux:0,mac:60}[this.#os]}}

    #crearDock(){
        if(this.#dock || !this.#contenedorDock || !this.#os) return;
            
        //this.#dock = new {mac:BarraMac}[this.#os](this.#contenedorDock,this.data);
        this.#dock=new Dock(this.#contenedorDock,this.data);
    }

    SistemaOperativo(os){
        if(this.#os != os && typeof os == 'string' && this.sistemas.includes(os)){
            if(!this.#tema){
                //ve si el usuario ya posee el tema oscuro por defecto
                this.#esTemaOscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                this.#tema = this.#esTemaOscuro ? 'oscuro':'claro';
                if(this.#esTemaOscuro) document.body.classList.add('dark-theme');}
            this.#os = os;
            this.#boolOs = [os == 'windows',os == 'linux', os == 'mac'];
            globalVanie.establecerBase(this.#os + '-' + this.#tema);
            //this.#estilar();
            this.#asignarClaseEscritorio();
            if(!this.#dock){
                this.#crearDock();}
            }
            
        return this;}

    interruptorTema(){
        if(this.#tema) {
            this.#tema = this.inversoTema;
            this.#esTemaOscuro = !this.#esTemaOscuro;
            document.body.classList.toggle('dark-theme');
            globalVanie.establecerBase(this.#os + '-' + this.#tema);
            this.#adminApp.forEach(aplicacion=>{if(aplicacion.cambiarTema) aplicacion.cambiarTema();});
        }
        return this;}

    registrarTiempo(ms){
        this.tiempoDeArranque = Date.now() - ms;
        return this;}

    get tema(){return this.#tema??'';}
    get temaOscuro(){return this.#esTemaOscuro;}
    get inversoTema(){return {oscuro:'claro', claro:'oscuro'}[this.#tema]};
    get sistemas(){return ['windows','mac','linux']}
    get os(){return this.#os??'';}
    get DOCK(){return this.#dock;}
    
    get sistemaValido(){return this.#tema && this.#os && globalVanie.esValido}
    get dockValido(){return this.#dock && this.#contenedorDock;}
    get ok(){return this.sistemaValido && this.dockValido}

    get esLinux(){return this.#boolOs[1]}
    get esMac(){return this.#boolOs[2]}
    get esWindows(){return this.#boolOs[0]}
}

const kernel = new Kernel;

globalVanie.addEventListener('registro',ventana=>{
    if(!kernel.esWindows)
        ventana.justificarCabecera = 'center';
    else
        ventana.justificarCabecera = 'start';
});

globalVanie.addEventListener('pulsar',()=>{
    if(kernel.esMac) kernel.DOCK.restaurar();});


export default kernel;