import { PaymentDisabledNotice } from "@/components/pilot/PaymentDisabledNotice";
import { useParams } from "react-router-dom";

const Payment = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  
  // Payments are disabled during pilot phase
  return <PaymentDisabledNotice appointmentId={appointmentId} />;
};

export default Payment;
