export const dialogState = () => {
  const isOpen = useState('isOpen' , () => false);

  const closeDialog = () => {
    isOpen.value = false
  }

  const openDialog = () => {
    isOpen.value = true
  }

  return {isOpen, closeDialog, openDialog};

}