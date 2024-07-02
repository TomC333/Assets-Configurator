/**
 * LoadingPopup handles the display and interaction of a loading popup in the UI.
 * This popup includes a loading animation, text content, and a close button.
 */
export class LoadingPopup{
    private static _loading_popup: HTMLDivElement = document.getElementById("loading-popup") as HTMLDivElement;

    private static _loading_animation: HTMLDivElement = this._loading_popup.querySelector(".loading-animation-container") as HTMLDivElement;
    private static _text_content_container: HTMLDivElement = this._loading_popup.querySelector(".text-content") as HTMLDivElement;
    private static _close_button: HTMLDivElement = this._loading_popup.querySelector(".close-button") as HTMLDivElement;

    private static _loading_animation_running: boolean = false;

    /**
     * Initializes the loading popup by adding event listeners and hiding it initially.
     */
    static init(){
        this._close_button.addEventListener("click", () => {
            this.hide();
        });

        this.hide();
    }

    /**
     * Displays the loading animation and shows the loading popup.
     */
    static show_loading_animation(): void{
        if(this._loading_animation_running){
            return;
        }

        this._loading_animation_running = true;
        this._loading_popup.classList.remove("hidden");
        this._loading_animation.classList.remove("hidden");
    }

    /**
     * Ends the loading animation and displays a message in the popup.
     * @param message The message to display when loading ends.
     */
    static end_loading_animation(message: string): void{
        this._loading_animation_running = false;
        this._text_content_container.innerText = message;
        
        this._loading_animation.classList.add("hidden");
        this._text_content_container.classList.remove("hidden");
    }

    /**
     * Hides the loading popup and resets its state.
     */
    static hide(): void {
        this._text_content_container.innerText = "";

        this._loading_popup.classList.add("hidden");
        this._loading_animation.classList.add("hidden");
        this._text_content_container.classList.add("hidden");
    }
}