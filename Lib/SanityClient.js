import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: 'od0ujvez',
  dataset: 'production',
  apiVersion: '2021-03-25',
  token:
   'skT8sNj7Ypkpe3GzgYCzq25svtDNytYgtHh13pMuYWJ2BdFYHn1rq83fHmjeq4Xi89x3bMuRzHxQQRgABT5WcOi81k0wJUKCelqKtsZTbOCyTMrrloj2qagYWmUZnQlnJp9VG5MlntSsSW5H0xssOKq6fRlaHftn591DYQEoScpPwR2nErXi',
  useCdn: false,
})