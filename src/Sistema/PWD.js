import kernel from "./Kernel";
const ESTADO = {error:0,ok:1,vacio:3,abierto:4}
export { ESTADO }
export default class Pwd{
    #dir = {}; #rutas =[];#origen; #app; #tipo = 0; #rutaActual; #historial; #nav; #cd = new Map;
    constructor(str){
        this.borrarHistorial();
        if(str) this.#origen = str;}
    get rutaActual(){return this.#rutaActual;}
    get app(){return this.#app;}
    get admin(){return this.#dir;}
    get origen(){return this.#origen;}
    get rutas(){return this.#rutas;}
    get cd(){return this.#cd;}
    get archivos(){return this.#dir.archivos}
    get exec(){return this.#dir.exec;}
    get tipo(){return this.#tipo;}
    get historial(){return this.#historial;}
    get navegacion(){return this.#nav;}

    obtenerClaveArchivo(idx){return this.this.#dir.llaves?.[idx];}
    obtenerNombreArchivo(llave){return this.#dir.exec?.[llave][0];}

    agregarRuta(pwd){
        if(!(pwd instanceof Pwd)) return;
        this.#tipo |= 1;
        if(!this.#dir.rutas){this.#dir.cd = {};}
        this.#rutas.push(pwd.origen);
        this.#cd.set(pwd.origen,pwd);}

    agregarArchivos(exec){
        if(!exec) return;
        this.#tipo |= 2;
        this.#dir.llaves = Object.keys(exec);
        this.#dir.archivos = this.#dir.llaves.map(llave=>exec[llave][0]);
        this.#dir.exec = exec;}

    nuevoArchivo(archivo){
        this.#tipo |= 2;
        const [llave,nombreArchivo,ruta] = archivo;
        if(this.#dir?.exec?.[llave]){
            this.#dir.exec[llave] = [nombreArchivo,ruta];
            this.agregarArchivos(this.#dir.exec);}
        else{
            if(!this.#dir.llaves) this.#dir.llaves = [];
            if(!this.#dir.archivos) this.#dir.archivos =[];
            if(!this.#dir.exec) this.#dir.exec = {};

            this.#dir.exec[llave] = [nombreArchivo,ruta];
            this.#dir.llaves.push(llave);
            this.#dir.archivos.push(nombreArchivo);}}

    abrirCon(str){
        if(typeof str == 'string') 
            this.#app = kernel.aplicacion(str);
        else if(str) this.#app = str;}

    borrarHistorial(){
        this.#rutaActual = this;
        this.#nav = [];
        this.#historial = [];}

    #registrarHitorial(pwd,cd){
        this.#rutaActual = pwd;
        this.#nav.push(pwd.origen);
        this.#historial.push(cd);}

    ir(cd){
        const cdActual = this.#rutaActual;
        if(cdActual.tipo == 0 || (!cdActual.rutas.length && !cdActual.archivos)) return ESTADO.vacio;
        if(typeof cd == 'number'){
            let enrutado = true;
            if(cdActual.rutas.length && (cd > (cdActual.rutas.length - 1) && cdActual.archivos?.length)){
                enrutado = false;
                cd -= (cdActual.rutas.length - 1);}

            if(enrutado && cdActual.tipo & 1){
                const ruta = cdActual.rutas[cd];
                if(ruta){
                    this.#registrarHitorial(cdActual.cd.get(ruta),cd);
                    return ESTADO.ok;}}

            if(cdActual.app && (cdActual.tipo & 2)){
                const CD = cdActual.admin.llaves[cd];
                if(!CD) return ESTADO.error;
                cdActual.app.abrir(CD);
                return ESTADO.abierto;}}
        return ESTADO.error;}}