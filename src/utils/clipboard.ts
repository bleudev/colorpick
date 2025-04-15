const get_copied_text = () => {
  return 'Copied to clipboard!'
}

export default function copy_and_alert(value: string): void {
  navigator.clipboard.writeText(value);
  alert(get_copied_text());
}