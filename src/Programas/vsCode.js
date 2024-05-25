import kernel from "../Sistema/Kernel";
import UrlAplicacion from "../Sistema/UrlAplicacion";
import { ico } from "../Data/iconos";
import Pwd from "../Sistema/PWD";

const proyectos = new Pwd('Codigo');
proyectos.agregarArchivos({
    juego:['juego.js','https://github1s.com/NekoShooter/juego/blob/master/juego.js'],
    coloref:['coloref.cpp','https://github1s.com/NekoShooter/ColoRef/blob/master/main.cpp'],
    qreloj:['QWatch.py','https://github1s.com/NekoShooter/QWatch/blob/main/main.py'],
    taimy:['Taimy.js','https://github1s.com/NekoShooter/Taimy/blob/master/Taimy.js'],
    ansky:['Ansky.js','https://github1s.com/NekoShooter/Ansky/blob/master/Ansky.js'],
    nauty:['Nauty.js','https://github1s.com/NekoShooter/Nauty/blob/master/Nauty.js'],
    grafico:['grafico.js','https://github1s.com/NekoShooter/matJs/blob/master/graficoSalarial/grafico.js']});

export default class vsCode{
    #vs;
    constructor(){
        kernel.registrarApp('code','vsCode',this);
        kernel.agregarNuevaRuta(proyectos);
        proyectos.abrirCon(this);
        this.#vs = new UrlAplicacion('code','vsCode',ico.code);
        this.#vs.url = proyectos.exec;
        this.#vs.app.personalizarCapturas = (id,dimencion)=>{
            const ventana = this.#vs.app.obtenerVentana(id);
            const marco = document.createElement('div');
            const extencion = ventana.titulo.split('.')[1];
            const lenguale = new Image;
            lenguale.src = ico[extencion];
            const img = new Image;
            img.src = './recursos/miniaturas_pref/minivs.webp';
            img.style = marco.style = `width:100%; height:100%;`;
            marco.style.position = 'relative';
            lenguale.style = `height:${dimencion.h/2}px;position:absolute; bottom:0;left:0; aspect-ratio:1;`;
            marco.appendChild(img);
            marco.appendChild(lenguale);
            return marco;}
        this.#vs.configurarVentana(ventana=>{
            ventana.cambiarDimensionInicial('80%','80%');
        })}

    abrir(nombreProyecto){
        let continuar = true;
        this.#vs.app.forEach(ventana=>{
            if(ventana.titulo == proyectos.obtenerNombreArchivo(nombreProyecto)){
                continuar = false;
                ventana.abrir();}});
        if(continuar)
            this.#vs.abrirInstancia(nombreProyecto);}
}
