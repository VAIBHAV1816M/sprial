"use client";

import Phase3UI from "../../components/phase3/Phase3UI";
import { usePhase3 } from "../../components/phase3/usePhase3";

export default function Phase3Page() {

  const phase3 = usePhase3();

  return <Phase3UI {...phase3} />;

}