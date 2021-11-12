import * as React from "react";
import { useEffect, useState } from "react";
import Layout from "../../components/common/layout";
import Breadcrumbs from "../../components/common/breadcrumbs";
import { Grid } from "@mui/material";
import ActionMenu from "../../components/common/actionMenu";
import { useUrlContext } from "../../context/urlContext";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionSummary, Paragraph, AccordionDetails } from "@gemeente-denhaag/denhaag-component-library";
import { getUser, isLoggedIn, logout } from "../../services/auth";

function Index() {
  let context = useUrlContext();

  const [data, setData] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isLoggedIn()) {
        getPerson();
        //getDossiers();
      }
    }
  }, []);

  const getPerson = () => {
    fetch(context.apiUrl + "/gateways/brp/ingeschrevenpersonen/" + getUser().username + "?expand=ouders,kinderen", {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then((data) => {
        if (data.error !== undefined && data.error.status !== undefined && data.error.status == 404) {
          getPersonWithoutExpand();
        } else {
          setData(data);
        }
      });
  }

  const getPersonWithoutExpand = () => {
    fetch(context.apiUrl + "/gateways/brp/ingeschrevenpersonen/" + getUser().username, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then((data) => {
        setData(data);
      });
  }

  return <>
    <Layout>
      <main>
        <Grid container>
          <Grid item sm={3}>
            <ActionMenu />
          </Grid>
          <Grid item sm={9}>

            <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Mijn gegevens', href: '/data' }]} />
            <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">Identiteit</h1>
            <br /><br />

            {
              data !== null &&
              <><Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                 <h3 className="utrecht-heading-3 utrecht-heading-3--distanced" >Persoonlijke gegevens</h3>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{ width: "100% !important" }}>
                    {
                      data.naam !== undefined &&
                      <h5 className="utrecht-heading-5 utrecht-heading-5--distanced" style={{ width: "100%" }}>Voornamen: <span style={{ textAlign: "right", float: "right" }}>{data.naam.voornamen}</span></h5>
                    }
                    {
                      data.naam !== undefined &&
                      <h5 className="utrecht-heading-5 utrecht-heading-5--distanced" style={{ width: "100%" }} >Achternaam: <span style={{ textAlign: "right", float: "right" }}>{data.naam.geslachtsnaam}</span></h5>
                    }
                    {
                      data.geslachtsaanduiding !== undefined &&
                      <h5 className="utrecht-heading-5 utrecht-heading-5--distanced" style={{ width: "100%" }} >Geslacht: <span style={{ textAlign: "right", float: "right" }}>{data.geslachtsaanduiding}</span></h5>
                    }
                  </div>
                </AccordionDetails>
              </Accordion>
                <br />
              </>
            }

            {
              data !== null && data['_embedded'] !== undefined && data['_embedded'] !== null && data['_embedded'].kinderen !== undefined && data['_embedded'].kinderen !== null &&
              <><Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                 <h3 className="utrecht-heading-3 utrecht-heading-3--distanced" >Kinderen</h3>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{ width: "100% !important" }}>
                    {
                      data['_embedded'].kinderen.map((row) => (
                        <>
                          {
                            row.naam.voornamen !== undefined && row.naam.voornamen !== null &&
                            <h5 className="utrecht-heading-5 utrecht-heading-5--distanced" style={{ width: "100%" }} >Voornamen: <span style={{ textAlign: "right", float: "right" }}>{row.naam.voornamen}</span></h5>
                          }
                          {
                            row.naam.voorvoegsel !== undefined && row.naam.voorvoegsel !== null ?
                              <h5 className="utrecht-heading-5 utrecht-heading-5--distanced" style={{ width: "100%" }} >Achternaam: <span style={{ textAlign: "right", float: "right" }}>{row.naam.voorvoegsel + ' ' + row.naam.geslachtsnaam}</span></h5> :
                              <h5 className="utrecht-heading-5 utrecht-heading-5--distanced" style={{ width: "100%" }} >Achternaam: <span style={{ textAlign: "right", float: "right" }}>{row.naam.geslachtsnaam}</span></h5>
                          }
                          {
                            row.geslachtsaanduiding !== undefined && row.geslachtsaanduiding !== null &&
                            <h5 className="utrecht-heading-5 utrecht-heading-5--distanced" style={{ width: "100%" }} >Geslacht: <span style={{ textAlign: "right", float: "right" }}>{row.geslachtsaanduiding}</span></h5>
                          }
                          <br />
                        </>
                      ))
                    }
                  </div>
                </AccordionDetails>
              </Accordion>
                <br />
              </>
            }

            {
              data !== null && data['_embedded'] !== undefined && data['_embedded'] !== null && data['_embedded'].ouders !== undefined && data['_embedded'].ouders !== null &&
              <>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <h3 className="utrecht-heading-3 utrecht-heading-3--distanced" >Ouders</h3>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ width: "100% !important" }}>
                      {
                        data['_embedded'].ouders.map((row) => (
                          <>
                            {
                              row.naam.voornamen !== undefined && row.naam.voornamen !== null &&
                              <h5 className="utrecht-heading-5 utrecht-heading-5--distanced" style={{ width: "100%" }} >Voornamen: <span style={{ textAlign: "right", float: "right" }}>{row.naam.voornamen}</span></h5>
                            }
                            {
                              row.naam.voorvoegsel !== undefined && row.naam.voorvoegsel !== null ?
                                <h5 className="utrecht-heading-5 utrecht-heading-5--distanced" style={{ width: "100%" }} >Achternaam: <span style={{ textAlign: "right", float: "right" }}>{row.naam.voorvoegsel + ' ' + row.naam.geslachtsnaam}</span></h5> :
                                <h5 className="utrecht-heading-5 utrecht-heading-5--distanced" style={{ width: "100%" }} >Achternaam: <span style={{ textAlign: "right", float: "right" }}>{row.naam.geslachtsnaam}</span></h5>
                            }
                            {
                              row.geslachtsaanduiding !== undefined && row.geslachtsaanduiding !== null &&
                              <h5 className="utrecht-heading-5 utrecht-heading-5--distanced" style={{ width: "100%" }} >Geslacht: <span style={{ textAlign: "right", float: "right" }}>{row.geslachtsaanduiding}</span></h5>
                            }
                            <br />
                          </>
                        ))
                      }
                    </div>
                  </AccordionDetails>
                </Accordion>
                <br />
              </>
            }

            {
              data !== null && data.verblijfplaats !== undefined && data.verblijfplaats !== null &&
              <>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <h3 className="utrecht-heading-3 utrecht-heading-3--distanced" >Woongegevens</h3>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ width: "100% !important" }}>
                      {
                        data.verblijfplaats.adresregel1 !== undefined && data.verblijfplaats.adresregel1 !== null &&
                        <h5 className="utrecht-heading-5 utrecht-heading-5--distanced" style={{ width: "100%" }} >Straat: <span style={{ textAlign: "right", float: "right" }}>{data.verblijfplaats.adresregel1}</span></h5>
                      }
                      {
                        data.verblijfplaats.woonplaats !== null &&
                        <h5 className="utrecht-heading-5 utrecht-heading-5--distanced" style={{ width: "100%" }} >Plaats: <span style={{ textAlign: "right", float: "right" }}>{data.verblijfplaats.woonplaats}</span></h5>
                      }
                      {
                        data.verblijfplaats.datumAanvangAdreshouding !== null &&
                        <h5 className="utrecht-heading-5 utrecht-heading-5--distanced" style={{ width: "100%" }} >Vanaf: <span style={{ textAlign: "right", float: "right" }}>{data.verblijfplaats.datumAanvangAdreshouding.datum}</span></h5>
                      }
                      <h5 className="utrecht-heading-5 utrecht-heading-5--distanced" style={{ width: "100%" }} >Aantal bewoners: <span style={{ textAlign: "right", float: "right" }}>3</span></h5>
                    </div>
                  </AccordionDetails>
                </Accordion>
                <br />
              </>
            }

            <>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Paragraph><h3 className="utrecht-heading-3 utrecht-heading-3--distanced">Reisdocumenten</h3></Paragraph>
                </AccordionSummary>
                <AccordionDetails >
                  <Paragraph>
                    <h5 className="utrecht-heading-5 utrecht-heading-5--distanced" style={{ width: "100%" }}>Paspoort: <span style={{ textAlign: "right", float: "right" }}>16561</span></h5>
                    <h5 className="utrecht-heading-5 utrecht-heading-5--distanced" style={{ width: "100%" }}>ID: <span style={{ textAlign: "right", float: "right" }}>65321684</span></h5>
                  </Paragraph>
                </AccordionDetails>
              </Accordion>
              <br />
            </>




          </Grid>
        </Grid>
      </main>
    </Layout>
  </>

}
export default Index
