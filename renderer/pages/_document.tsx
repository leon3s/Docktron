import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

const staticCss = `
#__next {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: transparent;
  }
  html, body {
    background: transparent;
    margin: 0px;
    min-height: 100%;
    height: 100%;
    max-height: 100%;
    overflow: auto;
  }
`;

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
            <style dangerouslySetInnerHTML={{ __html: staticCss }} />
            <link rel="stylesheet" href="/index.css" />
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en" >
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
