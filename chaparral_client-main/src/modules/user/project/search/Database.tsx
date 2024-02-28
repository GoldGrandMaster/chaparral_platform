import { useState } from 'react'
import { Label } from '@/common/components/ui/label'
import { Input } from "@/common/components/ui/input"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/common/components/ui/select'
import { Checkbox } from '@/common/components/ui/checkbox'
import { DatabaseParams } from './types'

export interface DatabaseProps {
  enzyme: string,
  setEnzyme: (en: string) => void,
  value: DatabaseParams,
  onChange: (value: DatabaseParams) => void,
}


export function DatabaseUI(props: DatabaseProps) {
  const enzymes = [
    { label: "Trypsin", setting: { cleave_at: "KR", restrict: null as null | string, c_terminal: true } },
    { label: "Chymotrypsin", setting: { cleave_at: "FWYL", restrict: null, c_terminal: true } },
    { label: "GluC", setting: { cleave_at: "DE", restrict: null, c_terminal: true } },
    { label: "Custom", setting: { cleave_at: "", restrict: null, c_terminal: true } },
  ]
  function preset(label: string) {
    let e = enzymes.find((e) => e.label == label);
    if (e) {
      props.onChange({ ...props.value, enzyme: { ...props.value.enzyme, ...e.setting } });
    }
    props.setEnzyme(label);
  }


  return (
    <>
      <div>
        <Label>Select an existing Fasta database</Label>
        <Select value={props.value.fasta} onValueChange={(ev) => props.onChange({ ...props.value, fasta: ev })}>
          <SelectTrigger id="framework">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="human"><i>H. sapiens</i> canonical</SelectItem>
            <SelectItem value="yeast"><i>S. cerevisae</i> canonical</SelectItem>
            <SelectItem value="ecoli"><i>E. coli</i> canonical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Enzyme</Label>
        <div>
          <Select value={props.enzyme} onValueChange={preset}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {enzymes.map((e, i) => (
                <SelectItem value={e.label} key={i}>{e.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <div>
            <Label htmlFor="cleave_at">Cleavage site</Label>
            <Input
              id="cleave_at"
              placeholder="Cleave at"
              value={props.value.enzyme.cleave_at}
              onChange={(ev) => props.onChange({ ...props.value, enzyme: { ...props.value.enzyme, cleave_at: ev.target.value } })}
            ></Input>
            <p className="invisible peer-invalid:visible text-red-500 text-sm">
              Invalid cleave site
            </p>
          </div>

          <div>
            <Label htmlFor="restrict">Restrict</Label>
            <Input
              id="restrict"
              placeholder="Restrict"
              value={props.value.enzyme.restrict || undefined}
              onChange={(ev) => props.onChange({ ...props.value, enzyme: { ...props.value.enzyme, restrict: ev.target.value.length > 0 ? ev.target.value : null } })}></Input>

            <p className="invisible peer-invalid:visible text-red-500 text-sm">
              Invalid restrict
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="c-terminal" checked={props.value.enzyme.c_terminal}
              onCheckedChange={(_) => props.onChange({ ...props.value, enzyme: { ...props.value.enzyme, c_terminal: !props.value.enzyme.c_terminal } })}
            ></Checkbox>
            <Label htmlFor='c-terminal'>C-terminal</Label>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div>
            <Label htmlFor='min-length'>Minimum peptide length</Label>
            <Input id='min-length' type='number' min={0} max={props.value.enzyme.max_len}
              value={props.value.enzyme.min_len}
              onChange={(ev) => props.onChange({ ...props.value, enzyme: { ...props.value.enzyme, min_len: ev.target.valueAsNumber } })}
              aria-invalid={props.value.enzyme.min_len > props.value.enzyme.max_len || props.value.enzyme.min_len > 60}
              className="peer invalid:ring-red-500 invalid:focus-visible:ring-red-300 invalid:ring-2"
            ></Input>
            <p className="invisible peer-invalid:visible text-red-500 text-sm">
              Invalid minimum peptide length
            </p>
          </div>

          <div>
            <Label htmlFor='min-length'>Maximum peptide length</Label>
            <Input id='min-length' type='number' min={props.value.enzyme.min_len} max={60}
              value={props.value.enzyme.max_len}
              onChange={(ev) => props.onChange({ ...props.value, enzyme: { ...props.value.enzyme, max_len: ev.target.valueAsNumber } })}
              aria-invalid={props.value.enzyme.max_len < props.value.enzyme.min_len || props.value.enzyme.max_len > 60}
              className="peer invalid:ring-red-500 invalid:focus-visible:ring-red-300 invalid:ring-2"
            ></Input>
            <p className="invisible peer-invalid:visible text-red-500 text-sm">
              Invalid maximum peptide length
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="semi-enzymatic" checked={props.value.enzyme.semi_enzymatic}
              onCheckedChange={(_) => props.onChange({ ...props.value, enzyme: { ...props.value.enzyme, semi_enzymatic: !props.value.enzyme.semi_enzymatic } })}
            ></Checkbox>
            <Label htmlFor='semi-enzymatic'>Semi-enzymatic</Label>
          </div>
        </div>
      </div>
    </>
  )
}

