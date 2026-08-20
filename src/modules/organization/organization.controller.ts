import type { Response, NextFunction } from "express";
import * as organizationService from "./organization.service";
import type { AuthRequest } from "../../middlewares/auth.middleware";

export const createOrganization = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organization = await organizationService.createOrganization({
      name: req.body.name,
      userId: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrganizations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organizations = await organizationService.getMyOrganizations(
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: organizations,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationBySlug = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params;

    if (!slug || Array.isArray(slug)) {
      throw new Error("Invalid organization slug");
    }

    const organization = await organizationService.getOrganizationBySlug(
      slug,
      req.user!.userId,
    );
    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganization = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params;

    if (!slug || Array.isArray(slug)) {
      return next(new Error("Invalid organization slug"));
    }
    const organization = await organizationService.updateOrganization(
      slug,
      req.user!.userId,
      req.body,
    );

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};

export const getorganizationById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return next(new Error("Invalid organization id"));
    }
    const organization = await organizationService.getOrganizationById(
      id,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrganization = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return next(new Error("Invalid organization id"));
    }
    await organizationService.deleteOrganization(id, req.user!.userId);

    res.status(200).json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const inviteMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return next(new Error("Invalid organization id"));
    }

    const invitation = await organizationService.inviteMember({
      organizationId: id,
      email: req.body.email,
      invitedById: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
};
export const acceptInvitation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await organizationService.acceptInvitation({
      invitationToken: req.body.invitationToken,
      userId: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
