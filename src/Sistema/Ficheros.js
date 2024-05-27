import kernel from "./Kernel";
import vsCode from "../Programas/vsCode";
import Ruta from "./Ruta";

const proyectos = new Ruta('Codigo','proyecto');
proyectos.agregarArchivos([
    ['juego.js',vsCode.comando,'https://github1s.com/NekoShooter/juego/blob/master/juego.js'],
    ['coloref.cpp',vsCode.comando,'https://github1s.com/NekoShooter/ColoRef/blob/master/main.cpp'],
    ['QWatch.py',vsCode.comando,'https://github1s.com/NekoShooter/QWatch/blob/main/main.py'],
    ['Taimy.js',vsCode.comando,'https://github1s.com/NekoShooter/Taimy/blob/master/Taimy.js'],
    ['Ansky.js',vsCode.comando,'https://github1s.com/NekoShooter/Ansky/blob/master/Ansky.js'],
    ['Nauty.js',vsCode.comando,'https://github1s.com/NekoShooter/Nauty/blob/master/Nauty.js'],
    ['grafico.js',vsCode.comando,'https://github1s.com/NekoShooter/matJs/blob/master/graficoSalarial/grafico.js']]);
proyectos.ordenar();

export default function cargarFicheros(){
    kernel.agregarNuevaRuta(proyectos);
    kernel.ruta.ordenar();
}
