(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-93a4f538"],{"2e95":function(e,t,n){"use strict";var i=n("2f78"),r=n.n(i);r.a},"2f78":function(e,t,n){},"4c62":function(e,t,n){"use strict";n.r(t);var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"container"}})},r=[],a=(n("63d9"),n("d225")),o=n("b0b4"),s=n("308d"),u=n("6bb5"),v=n("4e2b"),c=n("9ab4"),h=n("60a3"),l=n("5a89"),m=new function e(){Object(a["a"])(this,e),this.vertexShader="\n    precision highp float;\n    precision highp float;\n\n\t\tuniform mat4 modelViewMatrix;\n    uniform mat4 projectionMatrix;\n    uniform float time;\n    uniform sampler2D texture2;\n\n    attribute vec3 position;\n    // attribute vec4 color;\n    attribute vec2 uv;\n\n\t\tvarying vec3 vPosition;\n    varying vec4 vColor;\n    varying vec2 vUv;\n\n\t\tvoid main(){\n      vPosition = position;\n      // vColor = color;\n      vUv = uv;\n\n      gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );\n\t\t}\n  ",this.fragmentShader="\n    precision highp float;\n    precision highp float;\n\n    uniform sampler2D texture1;\n    uniform sampler2D texture2;\n    uniform sampler2D texture3;\n    uniform float time;\n\n    varying vec2 vUv;\n\t\tvarying vec3 vPosition;\n    varying vec4 vColor;\n\n\t\tvoid main() {\n      vec2 uv = vUv;\n      float sinTime = (sin(time)/2.0 + 0.5) * 0.05;\n      vec4 movement = texture2D(texture2, uv) * sinTime;\n\n      uv.x += movement.x;\n      uv.y += movement.y;\n\n      gl_FragColor = texture2D(texture3, uv);\n\t\t}\n  "},p=function(e){function t(){var e;return Object(a["a"])(this,t),e=Object(s["a"])(this,Object(u["a"])(t).apply(this,arguments)),e.camera=null,e.scene=null,e.renderer=null,e.controls=null,e.width=-1,e.height=-1,e}return Object(v["a"])(t,e),Object(o["a"])(t,[{key:"init",value:function(){var e=document.getElementById("container");this.width=e.clientWidth,this.height=e.clientHeight,this.scene=new l["p"],this.camera=new l["l"](30,this.width/this.height,.1,1e3),this.camera.position.z=10;var t=new l["m"](4,4),n=(new Float32Array([-1,-1,1,1,-1,1,1,1,1,1,1,1,-1,1,1,-1,-1,1]),new Float32Array([1,0,0,1,0,1,0,1,0,0,1,1,1,0,0,1,0,1,0,1,0,0,1,1]),(new l["q"]).load("/img/texture/texture.jpg"));n.wrapS=l["o"],n.wrapT=l["o"];var i=(new l["q"]).load("/img/texture/firemap.jpg");i.wrapS=l["o"],i.wrapT=l["o"];var r=(new l["q"]).load("/img/texture/space.jpg");r.wrapS=l["o"],r.wrapT=l["o"];var a=new l["n"]({uniforms:{texture1:{type:"t",value:n},texture2:{type:"t",value:i},texture3:{type:"t",value:r},time:{value:1}},vertexShader:m.vertexShader,fragmentShader:m.fragmentShader,side:l["c"],transparent:!0}),o=new l["j"](t,a);this.scene.add(o),this.renderer=new l["t"]({antialias:!0}),this.renderer.setSize(this.width,this.height),e&&e.appendChild(this.renderer.domElement)}},{key:"animate",value:function(){requestAnimationFrame(this.animate);var e=performance.now(),t=this.scene.children[0];t.material.uniforms.time.value=.005*e,this.renderer.render(this.scene,this.camera)}},{key:"mounted",value:function(){this.init(),this.animate()}},{key:"beforeDestroy",value:function(){this.scene.dispose(),this.renderer.dispose()}}]),t}(h["b"]);p=c["a"]([Object(h["a"])({components:{}})],p);var d=p,f=d,w=(n("2e95"),n("2877")),g=Object(w["a"])(f,i,r,!1,null,"21427b2d",null),x=g.exports;t["default"]=x}}]);
//# sourceMappingURL=chunk-93a4f538.df4112f9.js.map