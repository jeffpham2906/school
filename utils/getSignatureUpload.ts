export const getSignatureUpload = async (avatar: string) => {
  const fakepath = 'C:\\fakepath\\'
  const avatarName = String(state.avatar).substring(fakepath.length)
  if (avatarName) {
    const { data } = (await useAPI('/attachments/signature', {
      method: 'POST',
      body: { filename: avatarName },
    })) as AsyncData<{ data: object }, null>
    if (data.value) {
      signature.value = data.value?.data
    }
    return console.log(signature.value)
  }
}
