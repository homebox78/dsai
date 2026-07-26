import { Field as FormischField, useForm, type FormStore } from '@formisch/react'
import * as v from 'valibot'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ChoiceRow } from '@/components/common/ChoiceRow'
import { Select } from '@/components/common/select'
import type { ModalField } from './FormModal'

/**
 * Formisch(@formisch/react + valibot) 기반 폼 필드.
 * 검증 스키마는 시안의 필드 정의(필수·라벨)에서 자동으로 만들어진다.
 * shadcn Field(FieldLabel/FieldError)로 라벨·오류 표기를 통일한다.
 */

/** 필드 라벨로 valibot 스키마를 만든다 (필수·이메일·사업자번호·길이) */
function schemaFor(f: ModalField): v.GenericSchema<string, string> {
  const label = f.label
  let base: v.GenericSchema<string, string> = v.pipe(v.string(), v.trim())

  if (/이메일/.test(label)) {
    base = /초대|멤버/.test(label)
      ? v.pipe(
          base,
          v.regex(
            /^\s*$|^[^\s@,]+@[^\s@,]+\.[^\s@,]{2,}(\s*,\s*[^\s@,]+@[^\s@,]+\.[^\s@,]{2,})*$/,
            '이메일 형식이 올바르지 않습니다',
          ),
        )
      : v.pipe(base, v.regex(/^\s*$|^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, '이메일 형식이 올바르지 않습니다'))
  }
  if (/사업자/.test(label)) {
    base = v.pipe(base, v.regex(/^\s*$|^\d{3}-?\d{2}-?\d{5}$/, '사업자등록번호는 000-00-00000 형식입니다'))
  }
  if (/이름|제목|폴더|파일/.test(label)) {
    base = v.pipe(
      base,
      v.regex(/^[^\\/:*?"<>|]*$/, '이름에 \\ / : * ? " < > | 는 쓸 수 없습니다'),
      v.maxLength(60, `${label}은(는) 60자까지 입력할 수 있습니다`),
    )
  }
  if (/설명|내용/.test(label)) base = v.pipe(base, v.maxLength(300, `${label}은(는) 300자까지 입력할 수 있습니다`))

  return f.required ? v.pipe(base, v.minLength(1, `${label}을(를) 입력해주세요`)) : base
}

/** 시안 필드 정의 → Formisch 폼 스키마 */
export function buildFormSchema(fields: ModalField[]) {
  const shape: Record<string, v.GenericSchema<string, string>> = {}
  fields.forEach((f, i) => {
    if (f.type === 'text' || f.type === 'area') shape[`f${i}`] = schemaFor(f)
  })
  return v.object(shape)
}

export function useModalForm(fields: ModalField[]) {
  return useForm({ schema: buildFormSchema(fields) })
}

/** 텍스트·textarea 필드 (검증 연결) */
export function TextField({
  form,
  index,
  field,
  autoFocus,
}: {
  form: FormStore<ReturnType<typeof buildFormSchema>>
  index: number
  field: ModalField
  autoFocus?: boolean
}) {
  return (
    <FormischField of={form} path={[`f${index}`]}>
      {(store) => {
        const error = store.errors?.[0]
        return (
          <Field data-invalid={error ? true : undefined} className="mb-3.5 gap-1.5">
            <FieldLabel className="text-sm2 font-bold text-ink-700">
              {field.required ? `${field.label} *` : field.label}
            </FieldLabel>
            {field.type === 'area' ? (
              <Textarea
                {...store.props}
                rows={3}
                placeholder={field.placeholder}
                aria-invalid={!!error}
                className="resize-none rounded-[9px] border-ink-300 text-body"
              />
            ) : (
              <Input
                {...store.props}
                autoFocus={autoFocus}
                placeholder={field.placeholder}
                aria-invalid={!!error}
                className="rounded-[9px] border-ink-300 text-body"
              />
            )}
            {error ? (
              <FieldError className="text-xs2 font-semibold">{error}</FieldError>
            ) : (
              field.placeholder && (
                <FieldDescription className="sr-only">{field.placeholder}</FieldDescription>
              )
            )}
          </Field>
        )
      }}
    </FormischField>
  )
}

/** 선택 필드 (칩=RadioGroup / 셀렉트=커스텀 드롭다운) */
export function ChoiceField({
  field,
  name,
  value,
  onChange,
  ddKey,
}: {
  field: ModalField
  name: string
  value: string
  onChange: (v: string) => void
  ddKey?: string
}) {
  return (
    <Field className="mb-3.5 gap-1.5">
      <FieldLabel className="text-sm2 font-bold text-ink-700">
        {field.required ? `${field.label} *` : field.label}
      </FieldLabel>
      {field.type === 'chips' ? (
        <ChoiceRow name={name} value={value} options={field.options ?? []} onChange={onChange} />
      ) : (
        <Select ddKey={ddKey ?? name} value={value} options={field.options ?? []} onChange={onChange} />
      )}
    </Field>
  )
}
