export default function Layout(props) {
  return (
    <div className="page-layout">
      {props.children}
      <style jsx global>
        {`
          body {
            margin: 0;
            padding: 0;
            font-size: 18px;
            font-weight: 400;
            line-height: 1.8;
            color: #ffffff;
            font-family: sans-serif;
            background-color: #0d1117;
          }
        `}
      </style>
    </div>
  );
}
