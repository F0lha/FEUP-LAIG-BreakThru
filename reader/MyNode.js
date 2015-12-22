function MyNode(){

this.id = null;
this.material = null;
this.texture = null;
this.mat = mat4.create();
this.animationIDList = [];
this.animationList = [];

this.currentAnimation = 0;

this.descendants = [];
}