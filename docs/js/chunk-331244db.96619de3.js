(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-331244db"],{"55fc":function(t,e,n){},afae:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"container"}})},r=[],a=(n("63d9"),n("d225")),o=n("b0b4"),s=n("308d"),c=n("6bb5"),h=n("4e2b"),d=n("9ab4"),u=n("60a3"),l=n("5a89"),v=new function t(){Object(a["a"])(this,t),this.vertexShader="\n    precision highp float;\n\t\tuniform float sineTime;\n\t\tuniform mat4 modelViewMatrix;\n\t\tuniform mat4 projectionMatrix;\n\t\tattribute vec3 position;\n\t\tattribute vec3 offset;\n\t\tattribute vec4 color;\n\n\t\tvarying vec3 vPosition;\n\t\tvarying vec4 vColor;\n\t\tvoid main(){\n\t\t\tvPosition = offset  + position;\n\t\t\t\n\t\t\tvColor = color;\n\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );\n\t\t}\n  ",this.fragmentShader="\n    precision highp float;\n\t\tuniform float time;\n\t\tvarying vec3 vPosition;\n\t\tvarying vec4 vColor;\n\t\tvoid main() {\n\t\t\tvec4 color = vec4( vColor );\n\t\t\tcolor.r += sin( vPosition.x * 10.0 + time ) * 0.5;\n\t\t\tgl_FragColor = color;\n\t\t}\n  "},m=function(t){function e(){var t;return Object(a["a"])(this,e),t=Object(s["a"])(this,Object(c["a"])(e).apply(this,arguments)),t.camera=null,t.scene=null,t.renderer=null,t.width=-1,t.height=-1,t}return Object(h["a"])(e,t),Object(o["a"])(e,[{key:"init",value:function(){var t=document.getElementById("container");this.width=t.clientWidth,this.height=t.clientHeight,this.scene=new l["o"],this.camera=new l["k"](50,this.width/this.height,1,10),this.camera.position.z=2;new l["q"];var e=1,n=[],i=[],r=[];n.push(1,1,0),n.push(.5,.5,-.1),n.push(0,0,0);for(var a=0;a<e;a++)i.push(Math.random()-.5,Math.random()-.5,0),r.push(Math.random(),Math.random(),Math.random(),1);var o=new l["f"];o.maxInstancedCount=e,o.addAttribute("position",new l["d"](n,3)),o.addAttribute("offset",new l["e"](new Float32Array(i),3)),o.addAttribute("color",new l["e"](new Float32Array(r),4));var s=new l["m"]({uniforms:{time:{value:1},sineTime:{value:1}},vertexShader:v.vertexShader,fragmentShader:v.fragmentShader,side:l["c"],transparent:!0}),c=new l["i"](o,s);this.scene.add(c),this.renderer=new l["s"],this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(this.width,this.height),t&&t.appendChild(this.renderer.domElement)}},{key:"animate",value:function(){requestAnimationFrame(this.animate);performance.now(),this.scene.children[0];this.renderer.render(this.scene,this.camera)}},{key:"mounted",value:function(){this.init(),this.animate()}},{key:"beforeMount",value:function(){console.warn("Instancing BD"),this.scene.dispose(),this.renderer.dispose()}}]),e}(u["b"]);m=d["a"]([Object(u["a"])({components:{}})],m);var f=m,p=f,w=(n("b1d7"),n("2877")),b=Object(w["a"])(p,i,r,!1,null,"77f5b524",null),g=b.exports;e["default"]=g},b1d7:function(t,e,n){"use strict";var i=n("55fc"),r=n.n(i);r.a}}]);
//# sourceMappingURL=chunk-331244db.96619de3.js.map