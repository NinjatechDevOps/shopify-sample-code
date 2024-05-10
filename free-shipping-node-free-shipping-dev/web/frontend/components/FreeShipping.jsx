import { Form, FormLayout, TextField, Text, Page, AlphaCard, PageActions } from "@shopify/polaris";
import { useForm, useField } from "@shopify/react-form";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function FreeShipping() {
  const fetch = useAuthenticatedFetch();
  const shopData = useAppQuery({
    url: "/api/getShopSession"
  });

  const {
    fields,
    submit
  } = useForm({
    fields: {
      fsgoal: useField(),
      initialmessage: useField(),
      progressmessage: useField(),
      goalachievemessage: useField(),
    },
    async onSubmit(form) {
      var shippingData = {
        fsgoal: form.fsgoal,
        initialmessage: form.initialmessage,
        progressmessage: form.progressmessage,
        goalachievemessage: form.goalachievemessage,
        shopDomain: shopData.data.shopName
      }
      if (shopData.data) {
        // console.log(shopData.data.shopName);
      }
      const response = await fetch(`/api/createShipping`, {
        method: "POST",
        body: JSON.stringify(shippingData),
        headers: { "Content-Type": "application/json" },
      });
      return { status: 'success' };
    },
  });
  return (
    <Page
      title="Configure Free Shipping"
      primaryAction={{
        content: "Save",
        disabled: false,
        onAction: submit
      }}
    >
      <AlphaCard sectioned>
        <Form>
          <FormLayout>
            <TextField
              {...fields.fsgoal}
              name="fsgoal"
              label="Free Shipping Goal:"
              type="text"
              helpText={
                <span>
                  If no minimum order value is required, please set goal to 0
                </span>
              }
            />
            <TextField
              {...fields.initialmessage}
              name="initialmessage"
              label="Initial Message: "
              type="text"
              helpText={
                <span>
                  Display when cart is empty
                </span>
              }
            />

            <TextField
              {...fields.progressmessage}
              name="progressmessage"
              label="Progress Message:"
              type="text"
              autoComplete="text"
              helpText={
                <span>
                  Displays when cart value is less than the goal
                </span>
              }
            />

            <TextField
              {...fields.goalachievemessage}
              name="goalachievemessage"
              label="Goal Achieved Message:"
              type="text"
              autoComplete="text"
              helpText={
                <span>
                  Displays when cart value is greater than goal
                </span>
              }
            />

          </FormLayout>
        </Form>
      </AlphaCard>
      <PageActions

        primaryAction={{
          content: "Save",
          disabled: false,
          onAction: submit
        }}
      />
    </Page>
  );
}
