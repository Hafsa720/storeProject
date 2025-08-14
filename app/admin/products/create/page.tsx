import { log } from 'console'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { faker } from '@faker-js/faker'
import FormInput from '@/components/form/FormInput'
import ImageInput from '@/components/form/ImageInput'
import FormContainer from '@/components/form/FormContainer'
import TextArea from '@/components/form/TextAreaInput'
import { CreateProductAction } from '@/utils/actions'
import PriceInput from '@/components/form/PriceInput'
import CheckBoxInput from '@/components/form/CheckBoxInput'
import { SubmitButton } from '@/components/form/Button'
function CreateProductPage() {
  const name = faker.commerce.productName()
  const company = faker.company.name()
  const description = faker.lorem.paragraph({ min: 10, max: 12 })
  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 mt-3 capitalize'>
        create product
      </h1>
      <div className='border p-8 reounded-md'>
        <FormContainer action={CreateProductAction}>
          <div className='grid gap-4 md:grid-cols-2 my-4'>
            <FormInput
              type='text'
              name='product name'
              label=' name'
              defaultValue={name}
            />
            <FormInput
              type='text'
              name='company'
              label=' company'
              defaultValue={company}
            />

            <PriceInput />
            <ImageInput />
          </div>
          <TextArea
            name='description'
            labelText='product description'
            defaultValue={description}
          />
          <div className='mt-6'>
            <CheckBoxInput name='featured' label='featured' />
          </div>
          <SubmitButton text='create product' className='mt-3' />
        </FormContainer>
      </div>
    </section>
  )
}

export default CreateProductPage
