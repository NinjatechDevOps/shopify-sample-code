import {
  LegacyCard,
  Page,
  Layout,
  TextContainer,
  Image,
  LegacyStack,
  Link,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

import { trophyImage } from "../assets";

import { ProductsCard,FreeShipping } from "../components";

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <Page narrowWidth>
      <TitleBar title={t("HomePage.title")} primaryAction={null} />
      <Layout>
        <Layout.Section>
          <FreeShipping />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
