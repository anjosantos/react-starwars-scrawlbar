import "./App.css";
import { Scrawlbar } from "./components";

function App() {
  return (
    <section className="main-bg-container">
      <Scrawlbar>
        <section className="crawl" aria-live="polite">
          <div className="title" aria-hidden="true">
            <span className="episode">Episode IV</span>A NEW HOPE (summary)
          </div>

          <p>
            It is a period of civil war. Rebel spaceships, striking from a
            hidden base, have won their first victory against the evil Galactic
            Empire.
          </p>

          <p>
            During the battle, Rebel spies managed to steal secret plans to the
            Empire's ultimate weapon, the DEATH STAR, an armored space station
            with enough power to destroy an entire planet.
          </p>

          <p>
            Pursued by the Empire's sinister agents, Princess Leia races home
            aboard her starship, custodian of the stolen plans that can save her
            people and restore freedom to the galaxy....
          </p>

          <p>
            It is a period of civil war. Rebel spaceships, striking from a
            hidden base, have won their first victory against the evil Galactic
            Empire.
          </p>

          <p>
            During the battle, Rebel spies managed to steal secret plans to the
            Empire's ultimate weapon, the DEATH STAR, an armored space station
            with enough power to destroy an entire planet.
          </p>

          <p>
            Pursued by the Empire's sinister agents, Princess Leia races home
            aboard her starship, custodian of the stolen plans that can save her
            people and restore freedom to the galaxy....
          </p>
        </section>
      </Scrawlbar>
    </section>
  );
}

export default App;
