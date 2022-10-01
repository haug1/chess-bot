import { engine } from "./engine";

const interval = setInterval(() => {
  if (engine.isGame()) {
    clearInterval(interval);
    engine.mount();
  }
}, 1000);
