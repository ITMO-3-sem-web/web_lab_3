package ru.arina.maxim.validators;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

@FacesValidator("YInputValidator")
public class YInputValidator implements Validator {

    private static final FacesMessage errorMessage
            = new FacesMessage("Значение 'y' должно быть числом в диапазоне (-5 , 5).");

    @Override
    public void validate(FacesContext facesContext, UIComponent uiComponent, Object value) throws ValidatorException {
       double y;

       try {
           y = Double.parseDouble(String.valueOf(value));

           System.out.println("y = " + y);
           if ( y <= -5 || y >= 5)
               throw new NumberFormatException();

       } catch (NumberFormatException e) {
           System.out.println("Validator WORKS!");

           throw new ValidatorException(errorMessage);
       }
    }
}
