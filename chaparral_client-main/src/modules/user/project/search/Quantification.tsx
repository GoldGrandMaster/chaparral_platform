
import React, { useState } from 'react'
import { Label } from '@/common/components/ui/label'
import { Input } from "@/common/components/ui/input"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/common/components/ui/select'
import { Checkbox } from '@/common/components/ui/checkbox'
import { QuantificationSettings } from './types'


export interface QuantificationProps {
  value: QuantificationSettings,
  onChange: (value: QuantificationSettings) => void,
}

export function QuantificationUI(props: QuantificationProps) {
  return (
    <div className="space-x-2 grid grid-cols-2">
      <div className="space-y-4">
        <h1 className="font-bold">Label-free quantification</h1>

        <div className="flex items-center space-x-2">
          <Checkbox
            id='lfq'
            checked={props.value.lfq}
            onCheckedChange={(_) => {
              props.onChange({ ...props.value, lfq: !props.value.lfq });
            }} />
          <Label htmlFor='lfq'>Enable LFQ</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            id='ppm_tolerance'
            type="number"
            className="w-[100px]"
            value={props.value.lfq_settings.ppm_tolerance}
            onChange={(ev) => {
              props.onChange({ ...props.value, lfq_settings: { ...props.value.lfq_settings, ppm_tolerance: ev.target.valueAsNumber } });
            }} />
          <Label htmlFor='ppm_tolerance'>MS1 tolerance, in ppm, to use for XIC extraction</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            id='spectral'
            type="number"
            className="w-[100px]"
            step={0.1}
            max={1.0}
            min={0.1}
            value={props.value.lfq_settings.spectral_angle}
            onChange={(ev) => {
              props.onChange({ ...props.value, lfq_settings: { ...props.value.lfq_settings, spectral_angle: ev.target.valueAsNumber } });
            }} />
          <Label htmlFor='spectral'>Normalized spectral contrast angle (relative to theoretical isotopic envelope) cutoff for quantification </Label>
        </div>
      </div>


      <div className="space-y-4">
        <h1 className="font-bold">Reporter ion quantification</h1>

        <div className="flex items-center space-x-2">
          <span className="w-1/2">
            <Select
              value={props.value.tmt || undefined} onValueChange={(ev) => props.onChange({ ...props.value, tmt: ev })}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {["tmt6", "tmt10", "tmt11", "tmt16", "tmt18"].map((v, i) => {
                  return <SelectItem key={i} value={v}>{v.toUpperCase()}</SelectItem>
                })}
              </SelectContent>
            </Select>
          </span>
          <Label className='w-1/2'>TMT plex</Label>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-1/2">
            <Select
              value={props.value.tmt_settings.level.toString()} onValueChange={(ev) => props.onChange({ ...props.value, tmt_settings: { ...props.value.tmt_settings, level: Number(ev) } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[2, 3].map((v, i) => {
                  return <SelectItem key={i} value={v.toString()}>{`MS${v}`}</SelectItem>
                })}
              </SelectContent>
            </Select>
          </span>
          <Label className="w-1/2" htmlFor='level'>MSn level to use for reporter ion extraction</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id='sn'
            checked={props.value.tmt_settings.sn}
            onCheckedChange={(_) => {
              props.onChange({ ...props.value, tmt_settings: { ...props.value.tmt_settings, sn: !props.value.tmt_settings.sn } });
            }} />
          <Label htmlFor='sn'>Use signal-to-noise instead of intensity</Label>
        </div>

      </div>

    </div>

  )
}
