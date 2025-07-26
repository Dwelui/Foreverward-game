import * as THREE from 'three';

export default class SampleStaticScene {
    constructor(
        scene: THREE.Scene
    ) {
        const materialYellow = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const materialGreen = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const materialBlue = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const materialRed = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const materialPurple = new THREE.MeshBasicMaterial({ color: 0xff00ff });

        const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), materialYellow);
        const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materialRed);
        cube2.position.x -= 1;
        cube2.position.y -= 0.5;
        cube2.position.z -= 1;
        const cube3 = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 1), materialBlue);
        cube3.position.x += 1;
        cube3.position.y -= 0.75;
        cube3.position.z -= 1;

        scene.add(cube1);
        scene.add(cube2);
        scene.add(cube3);

        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 16), materialRed);
        sphere.position.x += 1.5;
        sphere.position.y -= 0.5;
        sphere.position.z += 2;

        scene.add(sphere);

        const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), materialGreen);
        floor.rotation.x -= Math.PI / 2;
        floor.position.y -= 1;
        scene.add(floor);

        const wall1 = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), materialPurple);
        wall1.position.z -= 5;
        const wall2 = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), materialPurple);
        wall2.position.x += 5;
        wall2.rotation.y -= Math.PI / 2;
        const wall3 = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), materialPurple);
        wall3.rotation.y += Math.PI / 2;
        wall3.position.x -= 5;
        scene.add(wall1);
        scene.add(wall2);
        scene.add(wall3);

    }
}
