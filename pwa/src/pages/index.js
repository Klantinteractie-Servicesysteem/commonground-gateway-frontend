import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/common/layout";
import {useUrlContext} from "../context/urlContext";
import DigiDImg from "../images/digid_button.svg";
import { UtrechtHeading1 } from "@utrecht/web-component-library-react";
import { getUser, isLoggedIn, logout } from "../services/auth";

const IndexPage = () => {
  const context = useUrlContext();

  React.useEffect(() => {
    console.log(context.apiUrl);
    console.log(context.meUrl);
    console.log(context.baseUrl);
    console.log(context.frontendUrl);
  }, []);

  return (
      <Layout>
        <main>
        <UtrechtHeading1>The Quick Brown Fox Jumps Over The Lazy Dog</UtrechtHeading1>
        <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">The Quick Brown Fox Jumps Over The Lazy Dog</h1>
        <title>Demodam</title>
          <div style={{textAlign: 'left'}}>
            <p>{context.baseUrl}</p>
            <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">Welkom</h1>
            <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">
              Dit is de skeleton NL Design applicatie.
            </h4>
            <p className="utrecht-p">
            Het doel van deze skeleton applicatie is om meerdere design tokens te testen over een set NL Design componenten. Ook zou je deze applicatie als template kunnen gebruiken om zelf een app te bouwen in NL Design. De link naar onze github repo: https://github.com/ConductionNL/nl-design-skeleton-gatsby
          </p>

          {
            isLoggedIn() ?
              <Link to="/data">
                <button class="utrecht-button" type="button">
                  <b class="utrecht-b" style={{ verticalAlign: 'middle' }}>
                    MIJN GEGEVENS
                  </b>
                </button>
              </Link>
              :
              <a className="utrecht-link" href={context.baseUrl + "/digid/login?returnUrl=" + context.frontendUrl + "/redirect"}>
                <button class="utrecht-button" type="button">
                  <img src={DigiDImg} width='55px' height='55px' />
                  <b className="utrecht-b" style={{textAlign: 'center', verticalAlign: 'middle', paddingLeft: '45px'}}>
                    INLOGGEN
                  </b>
                </button>
              </a>
        }

          <br/>
          <br/>

            <Link to="/cases">
              <button class="utrecht-button" type="button">
                <b className="utrecht-b" style={{verticalAlign: 'middle'}}>
                  Mijn aanvragen
                </b>
              </button>
            </Link>

          <br/>
          <br/>

            <Link to="/products">
              <button class="utrecht-button" type="button">
                <b className="utrecht-b" style={{verticalAlign: 'middle'}}>
                  Diensten
                </b>
              </button>
            </Link>

          <br />
          <br />

            <Link to="/vault">
              <button class="utrecht-button" type="button">
                <b className="utrecht-b" style={{verticalAlign: 'middle'}}>
                  Mijn Kluis
                </b>
              </button>
            </Link>

          <br />
          <br />

            <Link to="/data">
              <button class="utrecht-button" type="button">
                <b className="utrecht-b" style={{verticalAlign: 'middle'}}>
                  Mijn gegevens
                </b>
              </button>
            </Link>

          <br />
          <br />

          {/*<Accordion>*/}
          {/*  <AccordionSummary expandIcon={<ExpandMore />}>*/}
          {/*    <Paragraph>Click me to collapse me!</Paragraph>*/}
          {/*  </AccordionSummary>*/}
            {/*<AccordionDetails>*/}
            {/*  <Paragraph>*/}
            {/*    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo*/}
            {/*    lobortis eget.*/}
            {/*  </Paragraph>*/}
            {/*</AccordionDetails>*/}
          {/*</Accordion>*/}


            {/*<Grid container spacing={2} sx={{marginTop: '20px'}}>*/}
            {/*  */}{/* Start Verhuizen */}
            {/*  <Grid item xs={12} sm={6} lg={4}>*/}
            {/*    <Card>*/}
            {/*      <CardActionArea onClick={() => {window.location = 'https://verhuizen.demodam.nl'}}>*/}
            {/*        <CardContent sx={{textAlign: "center"}}>*/}
            {/*          <div style={{color: "black"}}>*/}
            {/*            <LocalShippingIcon sx={{fontSize: 80}} />*/}
            {/*          </div>*/}
            {/*          <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">*/}
            {/*            Verhuizen*/}
            {/*          </h4>*/}
            {/*        </CardContent>*/}
            {/*      </CardActionArea>*/}
            {/*    </Card>*/}
            {/*  </Grid>*/}
            {/*  */}{/* End Verhuizen */}
            {/*  */}{/* Start Begraven */}
            {/*  <Grid item xs={12} sm={6} lg={4}>*/}
            {/*    <Card>*/}
            {/*      <CardActionArea onClick={() => {window.location = 'https://begraven.demodam.nl/'}}>*/}
            {/*        <CardContent sx={{textAlign: "center"}}>*/}
            {/*          <div style={{color: "black"}}>*/}
            {/*            <AccountBalance sx={{fontSize: 80}} />*/}
            {/*          </div>*/}
            {/*          <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">*/}
            {/*            Begraven*/}
            {/*          </h4>*/}
            {/*        </CardContent>*/}
            {/*      </CardActionArea>*/}
            {/*    </Card>*/}
            {/*  </Grid>*/}
            {/*  */}{/* End Begraven */}
            {/*  */}{/* Start Digispoof */}
            {/*  <Grid item xs={12} sm={6} lg={4}>*/}
            {/*    <Card>*/}
            {/*      <CardActionArea onClick={() => {window.location = 'https://digispoof.demodam.nl/'}}>*/}
            {/*        <CardContent sx={{textAlign: "center"}}>*/}
            {/*          <div style={{color: "black"}}>*/}
            {/*            <Person sx={{fontSize: 80}} />*/}
            {/*          </div>*/}
            {/*          <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">*/}
            {/*            Digispoof*/}
            {/*          </h4>*/}
            {/*        </CardContent>*/}
            {/*      </CardActionArea>*/}
            {/*    </Card>*/}
            {/*  </Grid>*/}
            {/*  */}{/* End Digispoof */}
            {/*  */}{/* Start Huwelijksplanner */}
            {/*  <Grid item xs={12} sm={6} lg={4}>*/}
            {/*    <Card>*/}
            {/*      <CardActionArea onClick={() => {window.location = 'https://huwelijksplanner.demodam.nl/'}}>*/}
            {/*        <CardContent sx={{textAlign: "center"}}>*/}
            {/*          <div style={{color: "black"}}>*/}
            {/*            <Group sx={{fontSize: 80}} />*/}
            {/*          </div>*/}
            {/*          <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">*/}
            {/*            Huwelijksplanner*/}
            {/*          </h4>*/}
            {/*        </CardContent>*/}
            {/*      </CardActionArea>*/}
            {/*    </Card>*/}
            {/*  </Grid>*/}
            {/*  */}{/* End Huwelijksplanner */}
            {/*  */}{/* Start NLX */}
            {/*  <Grid item xs={12} sm={6} lg={4}>*/}
            {/*    <Card>*/}
            {/*      <CardActionArea onClick={() => {window.location = 'https://nlx.io/'}}>*/}
            {/*        <CardContent sx={{textAlign: "center"}}>*/}
            {/*          <div style={{color: "black"}}>*/}
            {/*            <AccountTree sx={{fontSize: 80}} />*/}
            {/*          </div>*/}
            {/*          <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">*/}
            {/*            NLX*/}
            {/*          </h4>*/}
            {/*        </CardContent>*/}
            {/*      </CardActionArea>*/}
            {/*    </Card>*/}
            {/*  </Grid>*/}
            {/*  */}{/* End Open Zaak */}
            {/*  <Grid item xs={12} sm={6} lg={4}>*/}
            {/*    <Card>*/}
            {/*      <CardActionArea onClick={() => {window.location = 'https://open-zaak.demodam.nl/'}}>*/}
            {/*        <CardContent sx={{textAlign: "center"}}>*/}
            {/*          <div style={{color: "black"}}>*/}
            {/*            <BusinessCenter sx={{fontSize: 80}} />*/}
            {/*          </div>*/}
            {/*          <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">*/}
            {/*            Open Zaak*/}
            {/*          </h4>*/}
            {/*        </CardContent>*/}
            {/*      </CardActionArea>*/}
            {/*    </Card>*/}
            {/*  </Grid>*/}
            {/*  */}{/* End Open Formulieren */}
            {/*  <Grid item xs={12} sm={6} lg={4}>*/}
            {/*    <Card>*/}
            {/*      <CardActionArea onClick={() => {window.location = 'https://openforms.maykin.demodam.nl/'}}>*/}
            {/*        <CardContent sx={{textAlign: "center"}}>*/}
            {/*          <div style={{color: "black"}}>*/}
            {/*            <Description sx={{fontSize: 80}} />*/}
            {/*          </div>*/}
            {/*          <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">*/}
            {/*            Open Formulieren*/}
            {/*          </h4>*/}
            {/*        </CardContent>*/}
            {/*      </CardActionArea>*/}
            {/*    </Card>*/}
            {/*  </Grid>*/}
            {/*  */}{/* End Open Formulieren */}
            {/*  */}{/* End Open Personen */}
            {/*  <Grid item xs={12} sm={6} lg={4}>*/}
            {/*    <Card>*/}
            {/*      <CardActionArea onClick={() => {window.location = 'https://open-personen.demodam.nl/'}}>*/}
            {/*        <CardContent sx={{textAlign: "center"}}>*/}
            {/*          <div style={{color: "black"}}>*/}
            {/*            <PersonOutline sx={{fontSize: 80}} />*/}
            {/*          </div>*/}
            {/*          <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">*/}
            {/*            Open Personen*/}
            {/*          </h4>*/}
            {/*        </CardContent>*/}
            {/*      </CardActionArea>*/}
            {/*    </Card>*/}
            {/*  </Grid>*/}
            {/*  */}{/* End Open Zaakbrug */}
            {/*  <Grid item xs={12} sm={6} lg={4}>*/}
            {/*    <Card>*/}
            {/*      <CardActionArea onClick={() => {window.location = 'https://sudwest-fryslan.github.io/OpenZaakBrug/'}}>*/}
            {/*        <CardContent sx={{textAlign: "center"}}>*/}
            {/*          <div style={{color: "black"}}>*/}
            {/*            <Description sx={{fontSize: 80}} />*/}
            {/*          </div>*/}
            {/*          <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">*/}
            {/*            Open Zaakbrug*/}
            {/*          </h4>*/}
            {/*        </CardContent>*/}
            {/*      </CardActionArea>*/}
            {/*    </Card>*/}
            {/*  </Grid>*/}
            {/*  */}{/* End Open Zaakbrug */}
            {/*  */}{/* End VrijBRP */}
            {/*  <Grid item xs={12} sm={6} lg={4}>*/}
            {/*    <Card>*/}
            {/*      <CardActionArea onClick={() => {window.location = 'http://vrij-brp.demodam.nl/personen'}}>*/}
            {/*        <CardContent sx={{textAlign: "center"}}>*/}
            {/*          <div style={{color: "black"}}>*/}
            {/*            <Groups sx={{fontSize: 80}} />*/}
            {/*          </div>*/}
            {/*          <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">*/}
            {/*            VrijBRP*/}
            {/*          </h4>*/}
            {/*        </CardContent>*/}
            {/*      </CardActionArea>*/}
            {/*    </Card>*/}
            {/*  </Grid>*/}
            {/*  */}{/* End VrijBRP */}
            {/*  */}{/* End Signalen */}
            {/*  <Grid item xs={12} sm={6} lg={4}>*/}
            {/*    <Card>*/}
            {/*      <CardActionArea onClick={() => {window.location = 'https://signalen.demodam.nl/'}}>*/}
            {/*        <CardContent sx={{textAlign: "center"}}>*/}
            {/*          <div style={{color: "black"}}>*/}
            {/*            <RecordVoiceOver sx={{fontSize: 80}} />*/}
            {/*          </div>*/}
            {/*          <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">*/}
            {/*            Signalen*/}
            {/*          </h4>*/}
            {/*        </CardContent>*/}
            {/*      </CardActionArea>*/}
            {/*    </Card>*/}
            {/*  </Grid>*/}
            {/*  */}{/* End Signalen */}
            {/*</Grid>*/}
          </div>
        </main>
      </Layout>

  )
}

export default IndexPage
