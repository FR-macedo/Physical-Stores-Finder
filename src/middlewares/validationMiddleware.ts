import { Request, Response, NextFunction } from 'express';

export const validateCep = (req: Request, res: Response, next: NextFunction) => {
  const { cep } = req.params;
  
  if (!cep) {
    return res.status(400).json({ message: 'CEP é obrigatório' });
  }
  
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) {
    return res.status(400).json({ message: 'Formato de CEP inválido. Use 8 dígitos numéricos.' });
  }
  
  // adicionando o CEP limpo ao request para uso posterior
  req.params.cep = cleanCep;
  next();
};