import Head from "next/head"

const MetaData: React.FC<{ title?: string }> = ({
  title = "Duelyst II Deckbuilder",
}) => {
  return (
    <Head>
      <title>{`Duelyst II Deckbuilder${title && ` | ${title}`}`}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta property="og:site_name" content="Duelyst II Deckbuilder" />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content="Duelyst II Deckbuilder & Browser"
      />
    </Head>
  )
}

export default MetaData
