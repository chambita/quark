/*
    quark, another tiny DOM utility

    Version     : 1.0.1
    Author      : Aurélien Delogu (dev@dreamysource.fr)
    Homepage    : https://github.com/pyrsmk/quark
    License     : MIT
*/

(function(){

    /*
        Retrieve only one node

        Parameters
            String, Node spec
            Node context

        Return
            Object
    */
    var $=function(spec,context){
        try{
            // Readiness
            if(typeof spec=='function'){
                return $._ready(spec);
            }
            // Return one node
            var nodelist;
            if(typeof spec=='string'){
                nodelist=getNodeList(spec,context);
            }
            else{
                nodelist=nodes2quark([spec]);
            }
            return nodelist.length?nodelist[0]:null;
        }
        catch(e){
            if(typeof spec=='string'){
                throw "An error has occured with $("+spec+") selector";
            }
            throw e;
        }
    },

    /*
        Retrieve a list of nodes

        Parameters
            String, Node spec
            Node context

        Return
            Object
    */
    $$=function(spec,context){
        try{
            // Get node list
            var nodelist;
            if(typeof spec=='string'){
                nodelist=getNodeList(spec,context);
            }
            else{
                nodelist=nodes2quark(spec);
            }
            // Add 'each' magic method
            nodelist.each=function(nodes){
                return function(func,i){
                    i=-1;
                    while(nodes[++i]){
                        func.apply(nodes[i],[i]);
                    }
                    return nodes[0];
                };
            }(nodelist);
            // Return node list
            return nodelist;
        }
        catch(e){
            if(typeof spec=='string'){
                throw "An error has occured with $$("+spec+") selector";
            }
            throw e;
        }
    },

    /*
        Get a node list

        Parameters
            String, Node spec
            Node context

        Return
            Array
    */
    getNodeList=function(spec,context){
        var a,nodelist=[];
        // Create new elements
        if(/</.test(spec)){
            if(a=$._creator(spec)){
                nodelist=[a];
            }
            else{
                a=document.createElement('div');
                a.innerHTML=spec;
                nodelist=[a=a.firstChild];
                while(a=a.nextSibling){
                    nodelist.push(a);
                }
            }
            nodelist=nodes2quark(nodelist);
        }
        // Get a node list
        else{
            nodelist=nodes2quark(
                $._selector(
                    quark2nodes(spec),
                    quark2nodes(context)
                )
            );
        }
        return nodelist;
    },

    /*
        Convert regular nodes to quark ones

        Parameters
            Array nodes

        Return
            Array
    */
    nodes2quark=function(nodes){
        // Prepare
        var node,
            _node=$._node,
            nodelist=[];
        // Compose nodes
        for(var i=0,j=nodes.length;i<j;++i){
            // Init node
            if(nodes[i].node===undefined){
                node={node:nodes[i]};
            }
            else{
                node={node:nodes[i].node};
            }
            // Plug composed node methods
            for(var k in _node){
                node[k]=function(node,method){
                    return function(){
                        return method.apply(node,arguments);
                    };
                }(node,_node[k]);
            }
            // Add node
            nodelist.push(node);
        }
        return nodelist;
    },

    /*
        Convert quark nodes to regular ones

        Parameters
            mixed nodes

        Return
            mixed
    */
    quark2nodes=function(nodes){
        if(typeof nodes=='object'){
            if(nodes.pop){
                for(var i=0,j=nodes.length;i<j;++i){
                    nodes[i]=quark2nodes(nodes[i]);
                }
            }
            else if(nodes.node){
                nodes=nodes.node;
            }
        }
        return nodes;
    };

    // Define internal vars
    $._ready    = function(){};
    $._selector = function(){};
    $._creator  = function(){};
    $._node     = {};

    // Export
    this.$=$;
    this.$$=$$;

})();