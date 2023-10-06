document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("canvas");
    const c = canvas.getContext("2d");
    var titulo = document.getElementById("titulo");
    var parrafo = document.getElementById("parrafo");

    

    var imagen1 = document.getElementById("Imagen1");
    var imagen2 = document.getElementById("Imagen2");
    var imagen3 = document.getElementById("Imagen3");
    var imagen4 = document.getElementById("Imagen4");
  
    var enlace = document.getElementById("enlace");
    var sectionTexto = document.getElementById("sectionTexto");
    var miSection = document.getElementById("miSection");
    canvas.width = 1024;
    canvas.height = 576;
    const audioGem = document.getElementById("AudioGem");
    const audio = document.getElementById("miAudio");
    const boton = document.getElementById("botonReproducirPausar");
    audio.volume = 0.15;
    audioGem.volume = 0;
    // Función para alternar la reproducción/pausa de la música
    let numeroSuma = 0;
    boton.addEventListener("click", () => {
      numeroSuma++;
      if (numeroSuma === 3) {
        numeroSuma = 1;
      }
      if (numeroSuma === 1) {
        audio.play();
        audioGem.volume = 0.25;
      } else if (numeroSuma === 2) {
        audio.pause();
        audioGem.volume = 0;
      }
    });
    audio.addEventListener("ended", function () {
      audio.play(); // Cambia la imagen a "play.png" cuando la música finaliza
    });
  
    class Sprite {
      constructor({
        position,
        imageSrc,
        frameRate = 1,
        animations,
        frameBuffer = 2,
        loop = true,
        autoplay = true,
        id
      }) {
        this.position = position;
        this.image = new Image();
        this.image.onload = () => {
          this.loaded = true;
          this.width = this.image.width / this.frameRate;
          this.height = this.image.height;
        };
        this.image.src = imageSrc;
        this.loaded = false;
        this.frameRate = frameRate;
        this.currentFrame = 0;
        this.elapsedFrames = 0;
        this.frameBuffer = frameBuffer;
        this.animations = animations;
        this.loop = loop;
        this.autoplay = autoplay;
        this.currentAnimation = {
          isActive: false
        };
        this.id = id;
        if (this.animations) {
          for (let key in this.animations) {
            const image = new Image();
            image.src = this.animations[key].imageSrc;
            this.animations[key].image = image;
          }
          console.log(this.animations);
        }
      }
      draw() {
        if (!this.loaded) return;
        const cropbox = {
          position: {
            x: this.width * this.currentFrame,
            y: 0
          },
          width: this.width,
          height: this.height
        };
        c.drawImage(
          this.image,
          cropbox.position.x,
          cropbox.position.y,
          cropbox.width,
          cropbox.height,
          this.position.x,
          this.position.y,
          this.width,
          this.height
        );
  
        this.updateFrames();
      }
  
      play() {
        this.autoplay = true;
      }
  
      updateFrames() {
        if (!this.autoplay) return;
        this.elapsedFrames++;
        if (this.elapsedFrames % this.frameBuffer === 0) {
          if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
          else if (this.loop) this.currentFrame = 0;
        }
        if (this.currentAnimation?.onComplete) {
          if (
            this.currentFrame === this.frameRate - 1 &&
            !this.currentAnimation.isActive
          ) {
            this.currentAnimation.onComplete();
            this.currentAnimation.isActive = true;
          }
        }
      }
    }
    //document.addEventListener("DOMContentLoaded", () => {
    //  }
    //clase-----------------------------------------------------------
    class Player extends Sprite {
      constructor({
        collisionBlocks = [],
        imageSrc,
        frameRate,
        animations,
        loop
      }) {
        super({ imageSrc, frameRate, animations, loop });
        this.position = {
          x: 200,
          y: 200
        };
  
        this.velocity = {
          x: 0,
          y: 0
        };
        this.sides = {
          bottom: this.position.x + this.height
        };
        this.gravity = 0.3;
  
        this.collisionBlocks = collisionBlocks;
      }
  
      update() {
        this.position.x += this.velocity.x;
        //bluebox
        //c.fillStyle = "rgba(0,0,255,0.5)";
        //c.fillRect(this.position.x, this.position.y, this.width, this.height);
        this.hitbox = {
          position: {
            x: this.position.x + 58,
            y: this.position.y + 34
          },
          width: 50,
          height: 53
        };
  
        //c.fillRect(
        //this.hitbox.position.x,
        //this.hitbox.position.y,
        //this.hitbox.width,
        //this.hitbox.height
        //);
  
        for (let i = 0; i < this.collisionBlocks.length; i++) {
          const collisionBlock = this.collisionBlocks[i];
  
          // if a collision exists
          if (
            this.hitbox.position.x <=
              collisionBlock.position.x + collisionBlock.width &&
            this.hitbox.position.x + this.hitbox.width >=
              collisionBlock.position.x &&
            this.hitbox.position.y + this.hitbox.height >=
              collisionBlock.position.y &&
            this.hitbox.position.y <=
              collisionBlock.position.y + collisionBlock.height
          ) {
            // collision on x axis going to the left
            if (this.velocity.x < -0) {
              const offset = this.hitbox.position.x - this.position.x;
              this.position.x =
                collisionBlock.position.x + collisionBlock.width - offset + 0.01;
              break;
            }
  
            if (this.velocity.x > 0) {
              const offset =
                this.hitbox.position.x - this.position.x + this.hitbox.width;
              this.position.x = collisionBlock.position.x - offset - 0.01;
              break;
            }
          }
        }
        //gravy
  
        //check colisions
        //above boton canvas
        this.velocity.y += this.gravity;
        this.position.y += this.velocity.y;
        this.hitbox = {
          position: {
            x: this.position.x + 58,
            y: this.position.y + 34
          },
          width: 50,
          height: 53
        };
  
        for (let i = 0; i < this.collisionBlocks.length; i++) {
          const collisionBlock = this.collisionBlocks[i];
  
          // if a collision exists
          if (
            this.hitbox.position.x <=
              collisionBlock.position.x + collisionBlock.width &&
            this.hitbox.position.x + this.hitbox.width >=
              collisionBlock.position.x &&
            this.hitbox.position.y + this.hitbox.height >=
              collisionBlock.position.y &&
            this.hitbox.position.y <=
              collisionBlock.position.y + collisionBlock.height
          ) {
            if (this.velocity.y < 0) {
              this.velocity.y = 0;
              const offset = this.hitbox.position.y - this.position.y;
              this.position.y =
                collisionBlock.position.y + collisionBlock.height - offset + 0.01;
              break;
            }
  
            if (this.velocity.y > 0) {
              this.velocity.y = 0;
              const offset =
                this.hitbox.position.y - this.position.y + this.hitbox.height;
              this.position.y = collisionBlock.position.y - offset - 0.01;
              break;
            }
          }
        }
      }
      handleInput(keys) {
        if (this.preventInput) return;
        this.velocity.x = 0;
        if (keys.d.pressed) {
          this.switchSprite("runRight");
          this.velocity.x = 2;
          this.lasDirection = "right";
        } else if (keys.a.pressed) {
          this.velocity.x = -2;
          this.switchSprite("runLeft");
          this.lasDirection = "left";
        } else {
          if (this.lasDirection === "left") {
            this.switchSprite("idleLeft");
          } else {
            this.switchSprite("idleRight");
          }
        }
      }
      switchSprite(name) {
        if (this.image === this.animations[name].image) return;
        this.currentFrame = 0;
        this.image = this.animations[name].image;
        this.frameRate = this.animations[name].frameRate;
        this.frameBuffer = this.animations[name].frameBuffer;
        this.loop = this.animations[name].loop;
        this.currentAnimation = this.animations[name];
      }
    }
  
    //funciones-------------------------------------------------------
    let ProximoNivel = 0;
    //Listeners-------------------------------------------------------
    window.addEventListener("keydown", (event) => {
      if (player.preventInput) return;
      switch (event.key) {
        case "w":
          for (let i = 0; i < doors.length; i++) {
            const door = doors[i];
            if (
              player.hitbox.position.x + player.hitbox.width <=
                door.position.x + door.width &&
              player.hitbox.position.x >= door.position.x &&
              player.hitbox.position.y + player.hitbox.height >=
                door.position.y &&
              player.hitbox.position.y <= door.position.y + door.height
            ) {
              if (door.id === 10) {
                ProximoNivel = 1;
              } else if (door.id === 11) {
                ProximoNivel = 2;
              } else if (door.id === 12) {
                ProximoNivel = 3;
              } else if (door.id === 13) {
                ProximoNivel = 4;
              } else if (door.id === 14) {
                ProximoNivel = 5;
              } else if (door.id === 15) {
                ProximoNivel = 6;
              }
              sectionTexto.style.backgroundColor = "#161616";
              miSection.style.backgroundColor = "#161616";
              imagen1.src =
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/Z3jV-CuadroNegro.jpeg";
              imagen2.src =
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/Z3jV-CuadroNegro.jpeg";
              imagen3.src =
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/Z3jV-CuadroNegro.jpeg";
              imagen4.src =
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/Z3jV-CuadroNegro.jpeg";
              // Cambia el texto del enlace y url
              enlace.textContent = "";
              enlace.href = "";
              titulo.textContent = "";
              parrafo.textContent = "";
              player.velocity.x = 0;
              player.velocity.y = 0;
              player.preventInput = true;
              player.switchSprite("enterDoor");
  
              door.play();
              return;
            }
          }
          if (player.velocity.y === 0) {
            player.velocity.y = -11.5;
          }
          break;
        case "a":
          keys.a.pressed = true;
          break;
  
        case "d":
          keys.d.pressed = true;
          break;
  
        case "e":
          for (let i = 0; i < cartes.length; i++) {
            const cartel = cartes[i];
            if (
              player.hitbox.position.x + player.hitbox.width <=
                cartel.position.x + cartel.width + 35 &&
              player.hitbox.position.x + 35 >= cartel.position.x &&
              player.hitbox.position.y + player.hitbox.height + 50 >=
                cartel.position.y &&
              player.hitbox.position.y - 50 <= cartel.position.y + cartel.height
            ) {
              audioGem.currentTime = 0;
              audioGem.play();
              if (cartel.id === 0) {
                player.velocity.y = 0;
                titulo.textContent = "Tutorial";
                parrafo.innerHTML =
                  "Bienvenido<br><br> En este juego podrás explorar e indagar acerca de la historia de la Universidad Autónoma de Occidente, desde sus inicios en los años 70 hasta ahora 2023, podrás encontrar información, imágenes y videos acerca de la UAO<br><br> Adéntrate en el castillo y mira que encuentras.";
                return;
              } else if (cartel.id === 1) {
                player.velocity.y = 0;
                titulo.textContent = "Tutorial";
                parrafo.innerHTML =
                  "Tu objetivo será recabar información acerca de como se fundó e instauro, la Universidad Autónoma de Occidente como la conocemos hoy en dia. <br> <br> <br> Entra en las habitaciones e interactúa con los diamantes.";
                return;
              } else if (cartel.id === 2) {
                
                player.velocity.y = 0;
                const seccionA1970 = document.getElementById("a1970");
                seccionA1970.scrollIntoView({ behavior: "smooth" });
                return;
              } else if (cartel.id === 3) {
               
                player.velocity.y = 0;
                const seccionA1970 = document.getElementById("a1970");
                seccionA1970.scrollIntoView({ behavior: "smooth" });
                return;
              } else if (cartel.id === 4) {
                
                player.velocity.y = 0;
                const seccionA1980 = document.getElementById("a1980");
                seccionA1980.scrollIntoView({ behavior: "smooth" });
                return;
              } else if (cartel.id === 5) {
                player.velocity.y = 0;
                const seccionA1980 = document.getElementById("a1980");
                seccionA1980.scrollIntoView({ behavior: "smooth" });
                return;
              } else if (cartel.id === 6) {
                
                player.velocity.y = 0;
                const seccionA1990 = document.getElementById("a1990");
                seccionA1990.scrollIntoView({ behavior: "smooth" });
                return;
              } else if (cartel.id === 7) {
                player.velocity.y = 0;
                const seccionA1990 = document.getElementById("a1990");
                seccionA1990.scrollIntoView({ behavior: "smooth" });
                return;
              } else if (cartel.id === 8) {
                player.velocity.y = 0;
                const seccionA2000 = document.getElementById("a2000");
                seccionA2000.scrollIntoView({ behavior: "smooth" });
                return;
              } else if (cartel.id === 9) {
                
                player.velocity.y = 0;
                const seccionA2000 = document.getElementById("a2000");
                seccionA2000.scrollIntoView({ behavior: "smooth" });
                return;
              } else if (cartel.id === 10) {
                
                player.velocity.y = 0;
                const seccionA2010 = document.getElementById("a2010");
                seccionA2010.scrollIntoView({ behavior: "smooth" });
                return;
              } else if (cartel.id === 11) {
                
                player.velocity.y = 0;
                const seccionA2010 = document.getElementById("a2010");
                seccionA2010.scrollIntoView({ behavior: "smooth" })
                return;
              }
              return;
            }
          }
          break;
      }
    });
    window.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "a":
          keys.a.pressed = false;
          break;
  
        case "d":
          keys.d.pressed = false;
          break;
      }
    });
  
    //js colisiones
    const collisionsLevel7 = [
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      0,
      0,
      0,
      292,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292
    ];
    const collisionsLevel2 = [
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      292,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      0,
      292,
      0,
      0,
      292,
      292,
      292,
      292,
      292,
      292,
      0,
      0,
      292,
      292,
      292,
      0,
      0,
      292,
      292,
      292,
      292,
      0,
      0,
      0,
      0,
      292,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      292,
      292,
      0,
      0,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      0,
      0,
      0,
      0
    ];
    const collisionsLevel3 = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      250,
      250,
      250,
      250,
      250,
      250,
      250,
      250,
      250,
      250,
      250,
      250,
      250,
      250,
      0,
      0,
      250,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      250,
      0,
      0,
      250,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      250,
      0,
      0,
      250,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      250,
      250,
      250,
      250,
      250,
      0,
      0,
      250,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      250,
      0,
      0,
      0,
      250,
      250,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      250,
      250,
      0,
      0,
      0,
      250,
      250,
      250,
      250,
      250,
      250,
      250,
      250,
      250,
      250,
      250,
      250,
      250,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ];
    const collisionsLevel4 = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      292,
      292,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      0,
      0,
      292,
      0,
      0,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      0,
      0,
      0,
      292,
      292,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      292,
      0,
      0,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      0,
      0,
      0,
      0
    ];
    const collisionsLevel5 = [
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      0,
      292,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      292,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      292,
      292,
      292,
      0,
      0,
      292,
      292,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      0,
      0,
      292,
      292,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      0,
      0,
      0,
      292,
      0,
      0,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      0,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      292,
      292
    ];
    const collisionsLevel6 = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      292,
      292,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      292,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      0,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      0,
      0,
      292,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      292,
      0,
      0,
      0,
      292,
      292,
      292,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      292,
      292,
      292,
      292,
      292,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ];
    Array.prototype.parse2D = function () {
      const rows = [];
      for (let i = 0; i < this.length; i += 16) {
        rows.push(this.slice(i, i + 16));
      }
  
      return rows;
    };
  
    class CollisionBlock {
      constructor({ position }) {
        this.position = position;
        this.width = 64;
        this.height = 64;
      }
      draw() {
        c.fillStyle = "rgba(255,0,0,0.5)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
      }
    }
    Array.prototype.createObjectsFrom2D = function () {
      const objects = [];
      this.forEach((row, y) => {
        row.forEach((Symbol, x) => {
          if (Symbol === 292 || Symbol === 250) {
            objects.push(
              // objects !collisionBlocks
              new CollisionBlock({
                position: {
                  x: x * 64,
                  y: y * 64
                }
              })
            );
          }
        });
      });
      return objects;
    };
    let parsedCollisions;
  
    let collisionBlocks;
  
    let background;
    let doors;
  
    const player = new Player({
      imageSrc:
        "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/qPp2-idle.png",
      frameRate: 11,
      animations: {
        idleRight: {
          frameRate: 11,
          frameBuffer: 6,
          loop: true,
          imageSrc:
            "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/qPp2-idle.png"
        },
        idleLeft: {
          frameRate: 11,
          frameBuffer: 6,
          loop: true,
          imageSrc:
            "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/nEnq-idleLeft.png"
        },
        runRight: {
          frameRate: 8,
          frameBuffer: 7,
          loop: true,
          imageSrc:
            "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/bqUk-runRight.png"
        },
        runLeft: {
          frameRate: 8,
          frameBuffer: 7,
          loop: true,
          imageSrc:
            "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/smpL-runLeft.png"
        },
        enterDoor: {
          frameRate: 8,
          frameBuffer: 7,
          loop: false,
          imageSrc:
            "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/KXfA-enterDoor.png",
          onComplete: () => {
            console.log("completado animacion");
  
            level++;
            if (level === 71) level = 1;
            levels[ProximoNivel].init();
            player.switchSprite("idleRight");
            player.preventInput = false;
          }
          // gsap.to(overlay, {
          // opacity: 1
          //});
          //}
        }
      }
    });
    let cartes;
    let level = 1;
    let levels = {
      1: {
        init: () => {
          parsedCollisions = collisionsLevel7.parse2D();
  
          collisionBlocks = parsedCollisions.createObjectsFrom2D();
          player.collisionBlocks = collisionBlocks;
          player.position.x = 130;
          player.position.y = 130;
          if (player.currentAnimation) player.currentAnimation.isActive = false;
          background = new Sprite({
            position: {
              x: 0,
              y: 0
            },
            imageSrc:
              "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/a0kK-backgroundLobby.png"
          });
  
          doors = [
            new Sprite({
              position: {
                x: 350,
                y: 144
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/vSVz-doorOpen.png",
              frameRate: 5,
              frameBuffer: 10,
              loop: false,
              autoplay: false,
              id: 11
            }),
            new Sprite({
              position: {
                x: 635,
                y: 144
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/vSVz-doorOpen.png",
              frameRate: 5,
              frameBuffer: 10,
              loop: false,
              autoplay: false,
              id: 12
            }),
            new Sprite({
              position: {
                x: 840,
                y: 400
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/vSVz-doorOpen.png",
              frameRate: 5,
              frameBuffer: 10,
              loop: false,
              autoplay: false,
              id: 13
            }),
            new Sprite({
              position: {
                x: 460,
                y: 400
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/vSVz-doorOpen.png",
              frameRate: 5,
              frameBuffer: 10,
              loop: false,
              autoplay: false,
              id: 14
            }),
            new Sprite({
              position: {
                x: 145,
                y: 400
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/vSVz-doorOpen.png",
              frameRate: 5,
              frameBuffer: 10,
              loop: false,
              autoplay: false,
              id: 15
            })
          ];
          cartes = [
            new Sprite({
              position: {
                x: 100,
                y: 215
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/pi9z-gemaAnim.png",
              frameRate: 5,
              frameBuffer: 18,
              id: 0
              //loop: false,
              //autoplay: false
            }),
            new Sprite({
              position: {
                x: 280,
                y: 215
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/pi9z-gemaAnim.png",
              frameRate: 5,
              frameBuffer: 18,
              id: 1
              //loop: false,
              //autoplay: false
            }),
            new Sprite({
              position: {
                x: 360,
                y: 110
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/I71w-texto1970edit.png",
  
              id: 50
              //loop: false,
              //autoplay: false
            }),
            new Sprite({
              position: {
                x: 645,
                y: 110
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/DkSB-texto1980edit.png",
  
              id: 50
              //loop: false,
              //autoplay: false
            }),
            new Sprite({
              position: {
                x: 850,
                y: 366
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/dJBJ-texto1990.png",
  
              id: 50
              //loop: false,
              //autoplay: false
            }),
            new Sprite({
              position: {
                x: 472,
                y: 366
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/FXDZ-texto2000.png",
  
              id: 50
              //loop: false,
              //autoplay: false
            }),
            new Sprite({
              position: {
                x: 155,
                y: 365
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/hQg6-texto2010.png",
  
              id: 50
              //loop: false,
              //autoplay: false
            })
          ];
        }
      },
      2: {
        init: () => {
          parsedCollisions = collisionsLevel2.parse2D();
  
          collisionBlocks = parsedCollisions.createObjectsFrom2D();
          player.collisionBlocks = collisionBlocks;
          player.position.x = 96;
          player.position.y = 140;
          if (player.currentAnimation) player.currentAnimation.isActive = false;
  
          background = new Sprite({
            position: {
              x: 0,
              y: 0
            },
            imageSrc:
              "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/0SN7-backgroundLevel2.png"
          });
  
          doors = [
            new Sprite({
              position: {
                x: 772,
                y: 336
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/vSVz-doorOpen.png",
              frameRate: 5,
              frameBuffer: 10,
              loop: false,
              autoplay: false,
              id: 10
            })
          ];
          cartes = [
            new Sprite({
              position: {
                x: 200,
                y: 470
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/pi9z-gemaAnim.png",
              frameRate: 5,
              frameBuffer: 18,
              id: 2
              //loop: false,
              //autoplay: false
            }),
            new Sprite({
              position: {
                x: 670,
                y: 400
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/pi9z-gemaAnim.png",
              frameRate: 5,
              frameBuffer: 18,
              id: 3
              //loop: false,
              //autoplay: false
            }),
            new Sprite({
              position: {
                x: 450,
                y: 120
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/7HXj-Decada70.png",
  
              id: 40
              //loop: false,
              //autoplay: false https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/7HXj-Decada70.png
            })
          ];
        }
      },
      3: {
        init: () => {
          parsedCollisions = collisionsLevel3.parse2D();
  
          collisionBlocks = parsedCollisions.createObjectsFrom2D();
          player.collisionBlocks = collisionBlocks;
          player.position.x = 750;
          player.position.y = 230;
          if (player.currentAnimation) player.currentAnimation.isActive = false;
          background = new Sprite({
            position: {
              x: 0,
              y: 0
            },
            imageSrc:
              "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/g82w-backgroundLevel3.png"
          });
  
          doors = [
            new Sprite({
              position: {
                x: 176,
                y: 335
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/vSVz-doorOpen.png",
              frameRate: 5,
              frameBuffer: 10,
              loop: false,
              autoplay: false,
              id: 10
            })
          ];
          cartes = [
            new Sprite({
              position: {
                x: 670,
                y: 400
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/pi9z-gemaAnim.png",
              frameRate: 5,
              frameBuffer: 18,
              id: 4
              //loop: false,
              //autoplay: false
            }),
            new Sprite({
              position: {
                x: 350,
                y: 400
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/pi9z-gemaAnim.png",
              frameRate: 5,
              frameBuffer: 18,
              id: 5
              //loop: false,
              //autoplay: false
            }),
            new Sprite({
              position: {
                x: 230,
                y: 20
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/9Vx7-Decada80.png",
  
              id: 40
              //loop: false,
              //autoplay: false https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/7HXj-Decada70.png
            })
          ];
        }
      },
      4: {
        init: () => {
          parsedCollisions = collisionsLevel4.parse2D();
  
          collisionBlocks = parsedCollisions.createObjectsFrom2D();
          player.collisionBlocks = collisionBlocks;
          player.position.x = 530;
          player.position.y = 70;
          if (player.currentAnimation) player.currentAnimation.isActive = false;
          background = new Sprite({
            position: {
              x: 0,
              y: 0
            },
            imageSrc:
              "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/Cmlu-backgroundLevel4.png"
          });
  
          doors = [
            new Sprite({
              position: {
                x: 160,
                y: 401
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/vSVz-doorOpen.png",
              frameRate: 5,
              frameBuffer: 10,
              loop: false,
              autoplay: false,
              id: 10
            })
          ];
          cartes = [
            new Sprite({
              position: {
                x: 840,
                y: 280
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/pi9z-gemaAnim.png",
              frameRate: 5,
              frameBuffer: 18,
              id: 6
              //loop: false,
              //autoplay: false
            }),
            new Sprite({
              position: {
                x: 350,
                y: 470
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/pi9z-gemaAnim.png",
              frameRate: 5,
              frameBuffer: 18,
              id: 7
              //loop: false,
              //autoplay: false
            }),
            new Sprite({
              position: {
                x: 35,
                y: 260
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/6MsB-Decada90.png",
  
              id: 40
              //loop: false,
              //autoplay: false https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/7HXj-Decada70.png
            })
          ];
        }
      },
      5: {
        init: () => {
          parsedCollisions = collisionsLevel5.parse2D();
  
          collisionBlocks = parsedCollisions.createObjectsFrom2D();
          player.collisionBlocks = collisionBlocks;
          player.position.x = 60;
          player.position.y = 40;
          if (player.currentAnimation) player.currentAnimation.isActive = false;
          background = new Sprite({
            position: {
              x: 0,
              y: 0
            },
            imageSrc:
              "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/dzwK-backgroundLevel5.png"
          });
  
          doors = [
            new Sprite({
              position: {
                x: 818,
                y: 401
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/vSVz-doorOpen.png",
              frameRate: 5,
              frameBuffer: 10,
              loop: false,
              autoplay: false,
              id: 10
            })
          ];
          cartes = [
            new Sprite({
              position: {
                x: 355,
                y: 340
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/pi9z-gemaAnim.png",
              frameRate: 5,
              frameBuffer: 18,
              id: 8
              //loop: false,
              //autoplay: false
            }),
            new Sprite({
              position: {
                x: 675,
                y: 210
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/pi9z-gemaAnim.png",
              frameRate: 5,
              frameBuffer: 18,
              id: 9
              //loop: false,
              //autoplay: false
            }),
            new Sprite({
              position: {
                x: 90,
                y: 475
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/XZRg-Decada2000.png",
  
              id: 40
              //loop: false,
              //autoplay: false https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/7HXj-Decada70.png
            })
          ];
        }
      },
      6: {
        init: () => {
          parsedCollisions = collisionsLevel6.parse2D();
  
          collisionBlocks = parsedCollisions.createObjectsFrom2D();
          player.collisionBlocks = collisionBlocks;
          player.position.x = 70;
          player.position.y = 320;
          if (player.currentAnimation) player.currentAnimation.isActive = false;
          background = new Sprite({
            position: {
              x: 0,
              y: 0
            },
            imageSrc:
              "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/Pwy9-backgroundLevel6.png"
          });
  
          doors = [
            new Sprite({
              position: {
                x: 825,
                y: 80
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/vSVz-doorOpen.png",
              frameRate: 5,
              frameBuffer: 10,
              loop: false,
              autoplay: false,
              id: 10
            })
          ];
          cartes = [
            new Sprite({
              position: {
                x: 390,
                y: 400
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/pi9z-gemaAnim.png",
              frameRate: 5,
              frameBuffer: 18,
              id: 10
              //loop: false,
              //autoplay: false
            }),
            new Sprite({
              position: {
                x: 680,
                y: 210
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/pi9z-gemaAnim.png",
              frameRate: 5,
              frameBuffer: 18,
              id: 11
              //loop: false,
              //autoplay: false
            }),
            new Sprite({
              position: {
                x: 300,
                y: 510
              },
              imageSrc:
                "https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/Xcyz-Decada2010.png",
  
              id: 40
              //loop: false,
              //autoplay: false https://uploads.codesandbox.io/uploads/user/3156bf58-da1a-417f-aab0-9f7c712ee73f/7HXj-Decada70.png
            })
          ];
        }
      }
    };
  
    const keys = {
      w: {
        pressed: false
      },
      a: {
        pressed: false
      },
      d: {
        pressed: false
      }
    };
    const overlay = {
      opacity: 0
    };
  
    function animate() {
      window.requestAnimationFrame(animate);
  
      background.draw();
      // IMPORTANTE, MALLA ROJAA, BOOL
      //collisionBlocks.forEach((CollisionBlock) => {
      //  CollisionBlock.draw();
      //});
      cartes.forEach((cartel) => {
        cartel.draw();
      });
  
      doors.forEach((door) => {
        door.draw();
      });
      player.handleInput(keys);
      player.draw();
      player.update();
  
      c.save();
      c.globalAlpha = overlay.opacity;
      c.fillStyle = "black";
      c.fillRect(0, 0, canvas.width, canvas.height);
      c.restore();
    }
  
    levels[level].init();
    animate();
  });
  window.onscroll = function () {
    myFunction();
  };
  
  var secciones = document.getElementsByTagName("section");
  var fechas = document.getElementsByClassName("fecha");
  
  function myFunction() {
    if (window.pageYOffset >= secciones[0].offsetTop) {
      eliminarClase();
    }
    if (window.pageYOffset >= secciones[1].offsetTop - 100) {
      eliminarClase();
      fechas[0].classList.add("seleccionado");
    } else if (window.pageYOffset < secciones[1].offsetTop - 100) {
      eliminarClase();
    }
    if (window.pageYOffset >= secciones[2].offsetTop - 100) {
        eliminarClase();
        fechas[1].classList.add("seleccionado");
      } else if (window.pageYOffset < secciones[1].offsetTop - 100) {
        eliminarClase();
      }
      if (window.pageYOffset >= secciones[3].offsetTop - 100) {
        eliminarClase();
        fechas[2].classList.add("seleccionado");
      } else if (window.pageYOffset < secciones[1].offsetTop - 100) {
        eliminarClase();
      }
      if (window.pageYOffset >= secciones[4].offsetTop - 100) {
        eliminarClase();
        fechas[3].classList.add("seleccionado");
      } else if (window.pageYOffset < secciones[1].offsetTop - 100) {
        eliminarClase();
      }
      if (window.pageYOffset >= secciones[5].offsetTop - 100) {
        eliminarClase();
        fechas[4].classList.add("seleccionado");
      } else if (window.pageYOffset < secciones[1].offsetTop - 100) {
        eliminarClase();
      }
      if (window.pageYOffset >= secciones[6].offsetTop - 100) {
        eliminarClase();
        fechas[5].classList.add("seleccionado");
      } else if (window.pageYOffset < secciones[1].offsetTop - 100) {
        eliminarClase();
      }
      if (window.pageYOffset >= secciones[7].offsetTop - 100) {
        eliminarClase();
        fechas[6].classList.add("seleccionado");
      } else if (window.pageYOffset < secciones[1].offsetTop - 100) {
        eliminarClase();
      }
  }
  
  function eliminarClase() {
    for (var i = 0; i < fechas.length; i++) {
      fechas[i].classList.remove("seleccionado");
    }
  }
  
  
