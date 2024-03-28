import type { AsyncData } from '#app'
import type { FileData } from '~/types'

const getSignatureUpload = (filename: string) => {
  return useAPI('/attachments/signature', {
    method: 'POST',
    body: {
      filename: filename,
    },
  })
}
interface FormData {
  postURL: string
  formData: {
    bucket: string
    key: string
    'x-amz-date': string
    'x-amz-algorithm': string
    'x-amz-credential': string
    policy: string
    'x-amz-signature': string
    'Content-Type': string | null
  }
  getUrl: string
}
export const doUpload = async (file: File): Promise<FileData | undefined> => {
  const toast = useToast()
  const { data: signData, error } = (await getSignatureUpload(
    file.name
  )) as AsyncData<{ data: FormData }, unknown>
  if (error.value) {
    toast.add({ title: 'GetSignature failed' })
    return undefined
  }
  const formDataReq = new FormData()
  const signFormData = toRaw(signData.value.data.formData)
  for (const key in signFormData) {
    //@ts-expect-error key
    formDataReq.append(key, signFormData[key])
  }
  formDataReq.append('file', file)

  return await $fetch(signData.value.data.postURL, {
    method: 'POST',

    body: formDataReq,
  }).then(() => {
    return {
      filename: file.name,
      ext: file.name.split('.')[1],
      key: signFormData.key,
      bucket: signFormData.bucket,
      url: signData.value.data.getUrl,
    }
  })
}
