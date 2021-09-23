import "./App.scss";

import { useEffect, useState, useCallback } from "react";
import { IntlProvider } from "react-intl";
import cx from "classnames";
import Mousetrap from "mousetrap";
import "mousetrap-global-bind";

import localization from "./localization";
import Header from "./components/Header";
import Step from "./components/Step";
import Navigation from "./components/Navigation";

import useOS from "./utils/useOS";

import data from "./data.json";
import shortcuts from "./shortcuts";

function App() {
  const defaultLang = "tr-tr";
  const { isDesktop } = useOS();
  const [lang, setLang] = useState(defaultLang);
  const [step, setStep] = useState(10);
  const [success, setSuccess] = useState(false);

  const prevStep = useCallback(
    (e) => {
      e.preventDefault();

      if (step > 0) {
        setStep(step - 1);
      }
    },
    [step]
  );

  const nextStep = useCallback(
    (e) => {
      e.preventDefault();

      if (!success) return;

      if (step < data.length - 1) {
        setStep(step + 1);
      }
    },
    [step, success]
  );

  const onChangeSuccess = (status) => {
    setSuccess(status);
  };

  useEffect(() => {
    Mousetrap.bindGlobal(shortcuts.rootKey, (e) => e.preventDefault());
    Mousetrap.bindGlobal(shortcuts.prevStep, prevStep);
    Mousetrap.bindGlobal(shortcuts.nextStep, nextStep);

    return () =>
      Mousetrap.unbindGlobal([
        shortcuts.prevStep,
        shortcuts.nextStep,
        shortcuts.rootKey,
      ]);
  }, [step, success, prevStep, nextStep]);

  return (
    <IntlProvider
      messages={localization[lang]}
      locale={lang}
      defaultLocale={defaultLang}
    >
      <div className={cx("App", { desktop: isDesktop })}>
        <Header lang={lang} setLang={setLang} steps={data} step={step} />
        <Step data={data[step]} step={step} onChangeSuccess={onChangeSuccess} />
        <Navigation
          steps={data}
          step={step}
          prevStep={prevStep}
          nextStep={nextStep}
          success={success}
        />
      </div>
    </IntlProvider>
  );
}

export default App;
