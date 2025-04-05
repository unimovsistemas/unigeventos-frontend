import { InputMask } from '@react-input/mask';

export default function InputDateMask() {
  return <InputMask mask="dd/mm/yyyy" replacement={{ d: /\d/, m: /\d/, y: /\d/ }} showMask separate />;
}