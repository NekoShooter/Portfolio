import { globalVanie } from "vanie";
import BarraMac from "./DockMac";
import Ruta from "./Ruta";

class Kernel{
    #os;
    #tema;
    #dock;
    #contenedorDock;
    #escritorio;
    #protector;
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
        this.#estilar();
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

    #estilar(){
        if(this.esMac && this.#escritorio){
            this.#escritorio.style.display = 'flex';
            this.#escritorio.style.alignItems ='end';
            this.#escritorio.style.justifyContent = 'center';}}

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
            
        this.#dock = new {mac:BarraMac}[this.#os](this.#contenedorDock,this.data);}

    SistemaOperativo(os){
        if(this.#os != os && typeof os == 'string' && ['windows','mac','linux'].includes(os)){
            if(!this.#tema){
                //ve si el usuario ya posee el tema oscuro por defecto
                const temaOscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                this.#tema = temaOscuro ? 'oscuro':'claro';}
            this.#os = os;
            globalVanie.establecerBase(this.#os + '-' + this.#tema);
            
            if(this.#dock) this.#dock = undefined;
            this.#estilar();
            this.#crearDock();}
            
        return this;}

    interruptorTema(){
        if(this.#tema) {
            this.#tema = {oscuro:'claro', claro:'oscuro'}[this.#tema];
            globalVanie.establecerBase(this.#os + '-' + this.#tema);}
        return this;}

    get tema(){return this.#tema??'';}
    get os(){return this.#os??'';}
    get DOCK(){return this.#dock;}
    
    get sistemaValido(){return this.#tema && this.#os && globalVanie.esValido}
    get dockValido(){return this.#dock && this.#contenedorDock;}
    get ok(){return this.sistemaValido && this.dockValido}

    get esLinux(){return this.#os == 'linux'}
    get esMac(){return this.#os == 'mac'}
    get esWindows(){return this.#os == 'windows'}
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