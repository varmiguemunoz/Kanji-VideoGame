const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 1280;
    canvas.height = 780;

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const gravity = 0.7;
    class Sprite {
      constructor({ position, velocity, color = "red", ofset }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastkey;
        this.attackBox = {
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          ofset,
          width: 100,
          height: 50,
        };
        this.color = color;
        this.isattacking;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        //atack box
        if (this.isattacking) {
          ctx.fillStyle = "blue";
          ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
      }
      update() {
        this.draw();
        this.attackBox.position.x = this.position.x - this.attackBox.ofset.x;
        this.attackBox.position.y = this.position.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
          this.velocity.y = 0;
        } else {
          this.velocity.y += gravity;
        }
      }
      attack() {
        this.isattacking = true;
        setTimeout(() => {
          this.isattacking = false;
        }, 1000);
      }
    }

    const player = new Sprite({
      position: {
        x: 0,
        y: 0,
      },
      velocity: {
        x: 0,
        y: 0,
      },
      ofset: {
        x: 0,
        y: 0,
      },
    });

    const enemy = new Sprite({
      position: {
        x: 400,
        y: 100,
      },
      velocity: {
        x: 0,
        y: 0,
      },
      ofset: {
        x: 50,
        y: 0,
      },
      color: "green",
    });

    //KEYBOARD INPUT
    const keys = {
      a: {
        pressed: false,
      },
      d: {
        pressed: false,
      },
      w: {
        pressed: false,
      },
      ArrowRight: {
        pressed: false,
      },
      Arrowleft: {
        pressed: false,
      },
    };

    function rectangularCollisionDetection({ rectangle1, rectangle2 }) {
      return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
      );
    }

    function animate() {
      window.requestAnimationFrame(animate);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      player.update();
      enemy.update();

      player.velocity.x = 0;
      enemy.velocity.x = 0;

      //PLAYER MOVEMENT
      if (keys.a.pressed && player.lastkey === "a") {
        player.velocity.x = -5;
      } else if (keys.d.pressed && player.lastkey === "d") {
        player.velocity.x = 5;
      }
      //ENEMY MOVEMENT
      if (keys.Arrowleft.pressed && enemy.lastkey === "ArrowLeft") {
        enemy.velocity.x = -5;
      } else if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
        enemy.velocity.x = 5;
      }

      //detect for collision
      if (
        rectangularCollisionDetection({
          rectangle1: player,
          rectangle2: enemy,
        }) &&
        player.isattacking
      ) {
        player.isattacking = false;
        console.log("collision");
      }

      if (
        rectangularCollisionDetection({
          rectangle1: enemy,
          rectangle2: player,
        }) &&
        enemy.isattacking
      ) {
        enemy.isattacking = false;
        console.log("enemy attack");
      }
    }
    animate();

    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "d":
          keys.d.pressed = true;
          player.lastkey = "d";
          break;
        case "a":
          keys.a.pressed = true;
          player.lastkey = "a";
          break;
        case "w":
          player.velocity.y = -20;
          break;
        case "k":
          player.attack();
          break;

        case "ArrowRight":
          keys.ArrowRight.pressed = true;
          enemy.lastkey = "ArrowRight";
          break;
        case "ArrowLeft":
          keys.Arrowleft.pressed = true;
          enemy.lastkey = "ArrowLeft";
          break;
        case "ArrowUp":
          enemy.velocity.y = -20;
          break;
        case "Enter":
          enemy.isattacking = true;
          break;
      }
      console.log(event.key);
    });

    window.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "d":
          keys.d.pressed = false;
          break;
        case "a":
          keys.a.pressed = false;
          break;

        //enemy keys

        case "ArrowRight":
          keys.ArrowRight.pressed = false;
          break;
        case "ArrowLeft":
          keys.Arrowleft.pressed = false;
          break;
      }
    });