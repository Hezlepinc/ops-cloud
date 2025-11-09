import type { NextPageContext } from "next";

function ErrorPage({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
        {statusCode ? `Error ${statusCode}` : "An error occurred"}
      </h1>
      <p style={{ color: "#71717a" }}>
        Please refresh the page. If the problem persists, try again later.
      </p>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? (err as any).statusCode : 404;
  return { statusCode };
};

export default ErrorPage;


