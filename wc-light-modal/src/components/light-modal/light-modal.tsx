// Inspired by https://codepen.io/timothylong/pen/HhAer

import { Component, Prop, Element, Method, Watch, h } from '@stencil/core';
// import { State } from '@stencil/core';


@Component({
    tag: 'wc-light-modal',
    styleUrl: 'light-modal.css',
    shadow: true,
})
export class LightModal {

    mid = "modal-card";
    mclass = "modal-card-visible";

    @Element() modal; 
    modalCard!: HTMLDivElement;
    modalContentDiv!: HTMLDivElement;

    @Prop() modalAnchor: string = "";

    @Prop() modalTitle: string = "TITLE";

    @Prop() modalContent: string = "HTML CONTENT";

    // If provided, the tooltip will display at the designated position
    @Prop() x = -1;
    @Prop() y = -1;


    // @Watch('modalTitle')
    // modalTitleChanged(newValue, oldValue) {

    // }

    @Watch('modalContent')
    modalTitleChanged(newValue, oldValue) {
        if(this.modalContentDiv && newValue != oldValue) {
            console.log("content div: ", this.modalContentDiv);
            this.modalContentDiv.innerHTML = newValue;
        }
    }

    componentDidLoad() {
        if(this.modalContentDiv) {
            console.log("content div: ", this.modalContentDiv);
            this.modalContentDiv.innerHTML = this.modalContent;
        }
    }

    @Method()
    async open() {
        console.log("open" , this.modalCard);
        if(this.modalCard.classList && !this.modalCard.classList.contains(this.mclass)) {
            this.modalCard.classList.add(this.mclass);     
        }
    }

    @Method()
    async close() {
        console.log("close" , this.modalCard);
        if(this.modalCard.classList && this.modalCard.classList.contains(this.mclass)) {
            this.modalCard.classList.remove(this.mclass);
        }
    }

    @Method()
    async toggle() {
        console.log("close" , this.modalCard);
        if(this.modalCard.classList) {
            if(this.modalCard.classList.contains(this.mclass)) {
                this.modalCard.classList.remove(this.mclass);
            } else {
                this.modalCard.classList.add(this.mclass);
            }
        }
    }

    // componentDidRender() {
    //     console.log("***** component did update: ", this.x, this.y);
    //     if(this.x != -1 && this.y != -1) {
    //         this.modalCard.style.top = "" + this.y;
    //         this.modalCard.style.left = "" + this.y;
    //         console.log("changing modal card pos: " , this.x , this.y);
    //     }
    // }
    
    render() {
        let classes = "modal-card";
        let styles = { };
        if(this.x != -1 && this.y != -1) {
            styles = { "top" : this.y + "px", "left" : this.x + "px" };
        }

        return (
            <div>
                {/* <span style={{"visibility":"hidden"}}>{this.trick}</span> */}
                {/* <button onClick={ () => this.toggle()}>Toggle</button> */}

                <div class={classes} style={styles} ref={(el) => this.modalCard = el as HTMLDivElement}>

                    <div id={this.mid} >
                        
                        <h1><span style={{ "text-align": "left"}}>{this.modalTitle}</span><button  style={{ "position": "absolute", "right": "2rem"}} onClick={() => this.close()}>X</button></h1>

                        <div id="modal-content" ref={(el) => this.modalContentDiv = el as HTMLDivElement}></div>

                    </div>
                </div>

            </div>
        )
    }

}