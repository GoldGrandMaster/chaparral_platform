import { useState } from 'react'
import { Label } from '@/common/components/ui/label'
import { Input } from "@/common/components/ui/input"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/common/components/ui/select'
import { Checkbox } from '@/common/components/ui/checkbox'
import { BaseParams, Tolerance, ToleranceKind } from './types'


interface ToleranceComponentProps {
  value: Tolerance,
  onChange: (value: Tolerance) => void,
}

function ToleranceComponent(props: ToleranceComponentProps) {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <div>
          <Label>Tolerance unit</Label>

          <Select value={props.value.kind} onValueChange={(ev) => props.onChange({ ...props.value, kind: ev as any })}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ppm">ppm</SelectItem>
              <SelectItem value="da">Da</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor='lower'>Lower tolerance</Label>
          <Input id='lower' type="number" value={props.value.lower}
            max={props.value.upper}
            onChange={(ev) => {
              props.onChange({ ...props.value, lower: ev.target.valueAsNumber })
            }} />
        </div>
        <div>
          <Label htmlFor='upper'>Upper tolerance</Label>
          <Input id='upper' type="number" value={props.value.upper}
            min={props.value.lower}
            onChange={(ev) => {
              props.onChange({ ...props.value, upper: ev.target.valueAsNumber })
            }} />
        </div>
      </div>

    </div>
  )
}

export interface ToleranceProps {
  applyClosed: string,
  setApplyClosed: (s: string) => void,
  value: BaseParams<Tolerance>,
  onChange: (value: BaseParams<Tolerance>) => void,
}

export function ToleranceUI(props: ToleranceProps) {

  const defaults = [
    {
      label: "Default closed search (High-res MS2)", settings: {
        precursor_tol: { kind: "ppm" as ToleranceKind, lower: -50.0, upper: 50.0 },
        fragment_tol: { kind: "ppm" as ToleranceKind, lower: -10.0, upper: 10.0 },
        isotope_errors: [-1, 3] as [number, number],
        deisotope: true,
      }
    },
    {
      label: "Default open search (High-res MS2)", settings: {
        precursor_tol: { kind: "ppm" as ToleranceKind, lower: -150.0, upper: 500.0 },
        fragment_tol: { kind: "ppm" as ToleranceKind, lower: -10.0, upper: 10.0 },
        isotope_errors: [0, 0] as [number, number],
        deisotope: true,
      }
    },
  ]

  function apply_default(label: string) {
    let d = defaults.find((d) => d.label == label);
    if (d !== undefined) {
      console.log(d);
      props.onChange({ ...props.value, ...d.settings });
    }
    props.setApplyClosed(label);
  }

  return (
    <div className="space-y-4">

      <Label>Apply a default?</Label>
      <div className="flex space-x-2">
        <Select value={props.applyClosed} onValueChange={apply_default}>
          <SelectTrigger>
            <SelectValue placeholder="Use a default..." />
          </SelectTrigger>

          <SelectContent>
            {defaults.map((d, i) => {
              return <SelectItem key={i} value={d.label}>{d.label}</SelectItem>
            })}
          </SelectContent>
        </Select>
      </div>
      <div>
        <h2 className="font-bold">Precursor tolerance</h2>
        <ToleranceComponent value={props.value.precursor_tol} onChange={(val) => props.onChange({ ...props.value, precursor_tol: val })} />
      </div>
      <div>
        <h2 className="font-bold">Precursor isotopic errors</h2>
        <div className="flex items-center space-x-2">
          <div>
            <Label htmlFor="isotope-lower">Isotope error lower</Label>
            <Input
              id="isotope-lower"
              type="number"
              min={-3}
              max={0}
              value={props.value.isotope_errors[0]}
              onChange={(ev) => props.onChange({ ...props.value, isotope_errors: [ev.target.valueAsNumber, props.value.isotope_errors[1]] })}
            />
          </div>
          <div>
            <Label htmlFor="isotope-upper">Isotope error upper</Label>
            <Input
              id="isotope-upper"
              type="number"
              min={0}
              max={5}
              value={props.value.isotope_errors[1]}
              onChange={(ev) => props.onChange({ ...props.value, isotope_errors: [props.value.isotope_errors[0], ev.target.valueAsNumber] })}
            />
          </div>
        </div>
      </div>
      <div>
        <h2 className="font-bold">Fragment tolerance</h2>
        <ToleranceComponent value={props.value.fragment_tol} onChange={(val) => props.onChange({ ...props.value, fragment_tol: val })} />
      </div>

      <div className="space-y-4">
        <h2 className="font-bold mb-2">Misc. settings</h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="deisotope"
              checked={props.value.deisotope}
              onCheckedChange={(_) => props.onChange({ ...props.value, deisotope: !props.value.deisotope })}
            />
            <Label htmlFor='deisotope'>MS2 deisotoping</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="chimera"
              checked={props.value.chimera}
              onCheckedChange={(_) => props.onChange({ ...props.value, chimera: !props.value.chimera })}
            />
            <Label htmlFor='chimera'>MS2 chimeric search</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wide-window"
              checked={props.value.wide_window}
              onCheckedChange={(_) => props.onChange({ ...props.value, wide_window: !props.value.wide_window })}
            />
            <Label htmlFor='wide-window'>Wide-window/DIA search</Label>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div>
            <Label>PSMs/spectra</Label>
            <Input type="number"
              onChange={(ev) => props.onChange({ ...props.value, report_psms: ev.target.valueAsNumber })}
              value={props.value.report_psms}></Input>
          </div>

          <div>
            <Label>Required b/y ions</Label>
            <Input type="number"
              onChange={(ev) => props.onChange({ ...props.value, min_matched_peaks: ev.target.valueAsNumber })}
              value={props.value.min_matched_peaks}></Input>
          </div>

          <div>
            <Label>Min peaks</Label>
            <Input type="number"
              onChange={(ev) => props.onChange({ ...props.value, min_peaks: ev.target.valueAsNumber })}
              value={props.value.min_peaks}></Input>
          </div>

          <div>
            <Label>Max peaks</Label>
            <Input type="number"
              onChange={(ev) => props.onChange({ ...props.value, max_peaks: ev.target.valueAsNumber })}
              value={props.value.max_peaks}></Input>
          </div>

          <div>
            <Label>Max fragment charge</Label>
            <Input type="number"
              onChange={(ev) => props.onChange({ ...props.value, max_fragment_charge: ev.target.valueAsNumber })}
              value={props.value.max_fragment_charge}></Input>
          </div>
        </div>
      </div>
    </div>
  )
}
