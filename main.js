import kernel from "./src/Sistema/Kernel";
import Menu from "./src/Programas/Menu";
import Folder from "./src/Programas/folder";
import vsCode from "./src/Programas/vsCode";
import Vbox from "./src/Programas/Vbox";

window.addEventListener('load',()=>{
    kernel.escritorio('escritorio').SistemaOperativo('mac').dock('dock').protectorPantalla('protector');
    const menu = new Menu;
    const folder = new Folder;
    const vscode =  new vsCode;
    const virtualBox = new Vbox;
});