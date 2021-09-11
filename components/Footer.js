import React from "react";
import Link from "next/link";
import { alpha, makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.backgroundColor,
    borderTop: "3px solid #F16569",
    padding: "2rem 0",
  },
  copyright: {
    padding: "1rem 0",
    textAlign: "center",
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg" className="mb-3">
        <Grid
          container
          spacing={1}
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          alignContent="stretch"
          wrap="wrap"
        >
          <Grid item xs={6} sm={6} lg={3}>
            <Typography variant="subtitle1" color="initial">
              Hỗ trợ khách hàng
            </Typography>
            <List>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Thẻ ưu đãi" />
                  </ListItem>
                </a>
              </Link>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Trung tâm bảo hành" />
                  </ListItem>
                </a>
              </Link>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Thanh toán và giao hàng" />
                  </ListItem>
                </a>
              </Link>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Dịch vụ sửa chữa và bảo trì" />
                  </ListItem>
                </a>
              </Link>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Doanh nghiệp thân thiết" />
                  </ListItem>
                </a>
              </Link>
            </List>
          </Grid>
          <Grid item xs={6} sm={6} lg={3}>
            <Typography variant="subtitle1" color="initial">
              Chính sách mua hàng
            </Typography>
            <List>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Thẻ ưu đãi" />
                  </ListItem>
                </a>
              </Link>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Trung tâm bảo hành" />
                  </ListItem>
                </a>
              </Link>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Thanh toán và giao hàng" />
                  </ListItem>
                </a>
              </Link>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Dịch vụ sửa chữa và bảo trì" />
                  </ListItem>
                </a>
              </Link>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Doanh nghiệp thân thiết" />
                  </ListItem>
                </a>
              </Link>
            </List>
          </Grid>
          <Grid item xs={6} sm={6} lg={3}>
            <Typography variant="subtitle1" color="initial">
              Về chúng tôi
            </Typography>
            <List>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Thẻ ưu đãi" />
                  </ListItem>
                </a>
              </Link>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Trung tâm bảo hành" />
                  </ListItem>
                </a>
              </Link>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Thanh toán và giao hàng" />
                  </ListItem>
                </a>
              </Link>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Dịch vụ sửa chữa và bảo trì" />
                  </ListItem>
                </a>
              </Link>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Doanh nghiệp thân thiết" />
                  </ListItem>
                </a>
              </Link>
            </List>
          </Grid>
          <Grid item xs={6} sm={6} lg={3}>
            <Typography variant="subtitle1" color="initial">
              Liên hệ
            </Typography>
            <List>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Thẻ ưu đãi" />
                  </ListItem>
                </a>
              </Link>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Trung tâm bảo hành" />
                  </ListItem>
                </a>
              </Link>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Thanh toán và giao hàng" />
                  </ListItem>
                </a>
              </Link>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Dịch vụ sửa chữa và bảo trì" />
                  </ListItem>
                </a>
              </Link>
              <Link href="#">
                <a>
                  <ListItem disableGutters className="py-0">
                    <ListItemText secondary="Doanh nghiệp thân thiết" />
                  </ListItem>
                </a>
              </Link>
            </List>
          </Grid>
        </Grid>
      </Container>
      <div className={classes.copyright}>
        Copyright © 2021 Bản quyền thuộc về MCTGear.
      </div>
    </footer>
  );
};

export default Footer;
