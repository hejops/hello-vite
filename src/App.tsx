import { LightstreamerClient, Subscription } from "lightstreamer-client-web";
import { useEffect, useState } from "react";

const PUIS = ["AIRLOCK000049", "S0000005"];

const LS_CLIENT = new LightstreamerClient(
  "https://push.lightstreamer.com/",
  "ISSLIVE", // https://blog.lightstreamer.com/2014/02/how-nasa-is-using-lightstreamer.html
);
LS_CLIENT.connect();

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button type="button" onClick={() => setCount((count) => count + 1)}>
        click count: {count}
      </button>
    </div>
  );
}

function Ticker() {
  const [time, setCount] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(new Date());
    }, 2_000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div>Time:</div>
      <div>{time.toString()}</div>
    </>
  );
}

function ISSRow({ pui }: Record<string, string>) {
  // https://sdk.lightstreamer.com/ls-web-client/9.2.1/api/index.html#quickstart
  // important: disable ubp in order to connect

  // mostly derived from
  // https://gist.github.com/simonw/76f03f49be58344bfa64c9d5d9f0ec29, a
  // single-file html that manually updates the dom

  // console.log(client.connectionDetails);

  const [val, setVal] = useState(0);
  const [name, setName] = useState("");
  const sub = new Subscription(
    // https://github.com/Lightstreamer/Lightstreamer-example-ISSLive-client-javascript/blob/master/src/assets/PUIList.xml
    // https://demos.lightstreamer.com/ISSLive/
    "MERGE",
    [pui],
    ["Value"],
  );
  sub.setRequestedSnapshot("yes");
  sub.addListener({
    onItemUpdate: (obj): void => {
      setVal(Number(obj.getValue("Value")));
      setName(obj.getItemName());
    },
  });
  LS_CLIENT.subscribe(sub);
  return (
    <tr style={{ fontFamily: "monospace" }}>
      <td>{name}</td>
      <td>{val}</td>
    </tr>
  );
}

function ISSTable() {
  return (
    <table>
      <tr>
        <th>Name</th>
        <th>Value</th>
      </tr>

      {PUIS.map((v, i) => (
        <ISSRow key={i.toString()} pui={v} />
      ))}
    </table>
  );
}

function App() {
  return (
    <>
      <Counter />
      <Ticker />
      <ISSTable />
    </>
  );
}

export default App;