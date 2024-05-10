import { useState, useCallback } from "react";
import { 
  LegacyCard, 
  TextContainer, 
  Banner,
  Form,
  FormLayout,
  TextField,
  Checkbox,
  Button,
  ChoiceList,
  Select,
  Thumbnail,
  Icon,
  LegacyStack,
  TextStyle,
  Layout,
  EmptyState,
  Text
 } from "@shopify/polaris";
import { 
  Toast,
  ContextualSaveBar,
  ResourcePicker,
  useNavigate,
 } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { useForm, useField, notEmptyString } from "@shopify/react-form";
import {useAppBridge} from "@shopify/app-bridge-react";

//import shopify from "../../shopify.js";

export function ProductsCard() {
  
  const [fsgoal, setFsgoal] = useState(0);
  const [initilaMessage, setInitialMessage] = useState();
  const [progressMessage, setProgressMessage] = useState();
  const [goalAchieveMessage, setGoalAchieveMessage] = useState();
  const [freeshippingdata, setFreeshippingdata] = useState();
  /* const [formData, setFormData] = useState({
    fsgoal: '',
    initialmessage: '',
    progressmessage: '',
    goalachievemessage: '',
    shop:''
  }); */
  
  const bridge = useAppBridge();
  const shopUrl = bridge.hostOrigin.replace('https://', '').replace('www.', '');
  /* const onSubmit = useCallback(
    (body) => {
      (async () => {
        const parsedBody = body;
        console.log(parsedBody);
        //parsedBody.destination = parsedBody.destination[0];
        
      })();
      return { status: "success" };
    },
    [freeshippingdata, setFreeshippingdata]
  ); */
  const {
    fields: {
      goal,
      initialmessage,
      progressmessage,
      goalachievemessage,
      shop,
    },
    dirty,
    reset,
    submitting,
    submit,
    makeClean,
  } = useForm({
    fields: {
      goal: useField({
        value: fsgoal || "",
        validates: [notEmptyString("Enter Order Amount to set for Goal")],
      }),
      initialmessage: useField({
        value: initilaMessage || "",
        validates: [notEmptyString("Please Enter initial message")],
      }),
      progressmessage: useField(progressMessage || ""),
      goalachievemessage: useField(goalAchieveMessage || ""),
      shop: useField(shopUrl)
    },
    async onSubmit(form) {
      console.log(form)
      return {status: 'success'};
     },
  });

  /* const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
  }; */

  const handleFsGoalChange = useCallback(
    (newValue) => setFsgoal(newValue),
    [],
  );

  const handleInitialMessageChange = useCallback(
    (newValue) => setInitialMessage(newValue),
    [],
  );

  const handleProgressMessageChange = useCallback(
    (newValue) => setProgressMessage(newValue),
    [],
  );
  
  const handleGoalachieveMessageChange = useCallback(
    (newValue) => setGoalAchieveMessage(newValue),
    [],
  );

  return (
    <>
    <Form>
      <ContextualSaveBar
              saveAction={{
                label: "Save",
                onAction: "submit",
                loading: submitting,
                disabled: submitting,
              }}
              discardAction={{
                label: "Discard",
                onAction: reset,
                loading: submitting,
                disabled: submitting,
              }}
              visible={dirty}
              fullWidth
            />
    
      <FormLayout>
        
        <TextField
          value={fsgoal}
          onChange={handleFsGoalChange}
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
          value={initilaMessage}
          onChange={handleInitialMessageChange}
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
          value={progressMessage}
          onChange={handleProgressMessageChange}
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
          value={goalAchieveMessage}
          onChange={handleGoalachieveMessageChange}
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

        <Button submit>Submit</Button>
      </FormLayout>
    </Form>
    </>
  );
}
