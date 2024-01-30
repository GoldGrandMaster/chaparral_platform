import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import styled from 'styled-components';

const FormWrapper = styled.form(() => ({
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #ccc'
}));

const Form = () => {
return <FormWrapper>
                  <Input
                name="username"
                placeholder="Your username"
                required
                autoFocus
                data-cy="username"
                value={""}
                style={{width:'225px'}}
              />
              <br />
</FormWrapper>
};

export default Form;